import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";

const RecipeContext = createContext<any>(null);

export const RecipeProvider = ({ children }: { children: React.ReactNode }) => {
    const { accounts, instance } = useMsal();

    const [recipes, setRecipes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const hasFetched = useRef(false);
    const [groceryList, setGroceryList] = useState<string[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        if (accounts.length > 0 && !hasFetched.current) {
            fetchRecipes();
        }
    }, [accounts]);

    const addIngredientsToGroceryList = async (ingredients: string[]) => {
        if (!ingredients || ingredients.length === 0) return;
        const newList = [...groceryList, ...ingredients];
        setGroceryList(newList);
        await updateGroceryListApi(newList);
    };

    const addToGroceryList = async (ingredient: string) => {
        if (!groceryList.includes(ingredient)) {
            const newList = [...groceryList, ingredient];
            // Optimistic update
            setGroceryList(newList);
            await updateGroceryListApi(newList);
        }
    };

    const removeFromGroceryList = async (ingredient: string) => {
        const newList = groceryList.filter(item => item !== ingredient);
        setGroceryList(newList);
        await updateGroceryListApi(newList);
    };

    const removeGroceryItemByIndex = async (index: number) => {
        const newList = [...groceryList];
        if (index >= 0 && index < newList.length) {
            newList.splice(index, 1);
            setGroceryList(newList);
            await updateGroceryListApi(newList);
        }
    };

    const updateGroceryListApi = async (newList: string[]) => {
        const payload = { Items: JSON.stringify(newList) };
        console.log("Updating grocery list with payload:", payload);
        try {
            const tokenResponse = await instance.acquireTokenSilent({
                scopes: [import.meta.env.VITE_SCOPE],
                account: accounts[0]
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL}/UpdateGroceries`, {
                method: 'PUT',
                headers: {
                    "Authorization": `Bearer ${tokenResponse.accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                console.error("Failed to update grocery list");
                // Revert state if failed
                await fetchRecipes(true);
            }
        } catch (error) {
            console.error("Error updating grocery list:", error);
            await fetchRecipes(true);
        }
    };

    const addRecipe = async (newRecipe: any) => {
        try {
            setLoading(true);
            const tokenResponse = await instance.acquireTokenSilent({
                scopes: [import.meta.env.VITE_SCOPE],
                account: accounts[0]
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL}/CreateRecipe`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${tokenResponse.accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newRecipe)
            });

            if (response.ok) {
                const createdRecipe = await response.json();

                // Validate that we actually got a RowKey back. 
                // If the Azure Function creates the ID but doesn't return it in the body, we can't use optimistic updates for navigation.
                const rowKey = createdRecipe.RowKey || createdRecipe.rowKey;

                if (rowKey) {
                    const safeRecipe = {
                        ...createdRecipe,
                        RowKey: rowKey,
                        // Ensure we have a timestamp for the "Recent Recipes" list logic
                        Timestamp: createdRecipe.Timestamp || new Date().toISOString()
                    };
                    setRecipes((prev: any[]) => [safeRecipe, ...prev]);
                } else {
                    console.warn("CreateRecipe response missing RowKey. Falling back to full fetch.");
                    await fetchRecipes(true);
                }
                
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error in addRecipe:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const fetchRecipes = async (force: boolean = false) => {
        if ((hasFetched.current && !force) || accounts.length === 0) return;

        try {
            setLoading(true);
            
            const tokenResponse = await instance.acquireTokenSilent({
                scopes: [import.meta.env.VITE_SCOPE],
                account: accounts[0]
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL}/GetRecipes`, {
                headers: { "Authorization": `Bearer ${tokenResponse.accessToken}` }
            });

            if (response.ok) {
                if (!force) hasFetched.current = true;
                const data = await response.json();
                
                const recipesData = data.Recipes || [];
                const groceryListsData = data.GroceryLists || [];

                // Handle Grocery List
                const groceryItem = groceryListsData.length > 0 ? groceryListsData[0] : null;
                if (groceryItem) {
                    try {
                        // The field in the new response is 'Items', but checking 'Ingredients' for backward compatibility doesn't hurt if the type is loose
                        const rawItems = groceryItem.Items || groceryItem.Ingredients;
                        if (rawItems) {
                             let parsed = JSON.parse(rawItems);
                             // Handle potential double-encoding
                             if (typeof parsed === 'string') {
                                 parsed = JSON.parse(parsed);
                             }
                             
                             if (Array.isArray(parsed)) {
                                 setGroceryList(parsed);
                             }
                        }
                    } catch (e) {
                        console.error("Failed to parse grocery list ingredients:", e);
                    }
                }

                // Separate the "Mixed Bag" from the Recipes array
                const onlyRecipes = recipesData.filter((item: any) => item.RowKey && item.RowKey.startsWith('recipe_'));
                // Assume anything that isn't a recipe is a category
                const onlyCategories = recipesData.filter((item: any) =>
                    item.RowKey &&
                    !item.RowKey.startsWith('recipe_') &&
                    item.RowKey !== 'GROCERY_LIST'
                );

                setRecipes(onlyRecipes);
                setCategories(onlyCategories);
            }
        } catch (error) {
            hasFetched.current = false;
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteRecipe = async (rowKey: string) => {
        try {
            setLoading(true);
            const tokenResponse = await instance.acquireTokenSilent({
                scopes: [import.meta.env.VITE_SCOPE],
                account: accounts[0]
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL}/DeleteRecipe`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${tokenResponse.accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ rowKey: rowKey })
            });

            if (response.ok) {
                // Update local state by filtering out the deleted recipe
                setRecipes((prev) => prev.filter((r: any) => r.RowKey !== rowKey));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error in deleteRecipe:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = async (categoryName: string) => {
        // Construct the RowKey. We assume the standard prefix 'category_' used in creation/seeding.
        // Note: The user might have legacy categories or case sensitivity issues.
        // We will try to find the exact entity in our state first to get the correct RowKey.
        const categoryEntity = categories.find((c: any) =>
            (c.RowKey === `category_${categoryName}`) ||
            (c.RowKey && c.RowKey.toLowerCase() === `category_${categoryName.toLowerCase()}`)
        );

        if (!categoryEntity || !categoryEntity.RowKey) {
            console.error("Category entity not found for deletion:", categoryName);
            return false;
        }

        const rowKey = categoryEntity.RowKey;

        try {
            setLoading(true);
            const tokenResponse = await instance.acquireTokenSilent({
                scopes: [import.meta.env.VITE_SCOPE],
                account: accounts[0]
            });

            // We assume /DeleteRecipe handles generic entity deletion by RowKey
            const response = await fetch(`${import.meta.env.VITE_API_URL}/DeleteRecipe`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${tokenResponse.accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ rowKey: rowKey })
            });

            if (response.ok) {
                setCategories((prev) => prev.filter((c: any) => c.RowKey !== rowKey));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error in deleteCategory:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateRecipe = async (updatedRecipe: any) => {
        try {
            setLoading(true);
            const tokenResponse = await instance.acquireTokenSilent({
                scopes: [import.meta.env.VITE_SCOPE],
                account: accounts[0]
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL}/UpdateRecipe`, {
                method: 'PUT',
                headers: {
                    "Authorization": `Bearer ${tokenResponse.accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedRecipe)
            });

            if (response.ok) {
                await fetchRecipes(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error in updateRecipe:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const createCategory = async (categoryName: string) => {
        try {
            setLoading(true);
            const tokenResponse = await instance.acquireTokenSilent({
                scopes: [import.meta.env.VITE_SCOPE],
                account: accounts[0]
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL}/CreateRecipeCategory`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${tokenResponse.accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ categoryName: categoryName })
            });

            if (response.ok) {
                await fetchRecipes(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error in createCategory:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return (
        <RecipeContext.Provider value={{ recipes, categories, fetchRecipes, loading, groceryList, addToGroceryList, addIngredientsToGroceryList, removeFromGroceryList, removeGroceryItemByIndex, addRecipe, deleteRecipe, deleteCategory, updateRecipe, createCategory }}>
            {children}
        </RecipeContext.Provider>
    );
};

export const useRecipes = () => useContext(RecipeContext);  