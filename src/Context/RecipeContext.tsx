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
                // We successfully created the recipe.
                // Force a re-fetch to ensure we have the exact data from the server (including generated RowKey, Timestamp, etc.)
                // This handles potential case-sensitivity mismatches or incomplete response data.
                await fetchRecipes(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error in addRecipe:", error);
            // Even on error, try to fetch. The error might be a network timeout on response, but the write could have succeeded.
            await fetchRecipes(true);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const fetchRecipes = async (force: boolean = false) => {
        if ((hasFetched.current && !force) || accounts.length === 0) return;

        try {
            setLoading(true);
            // Don't set hasFetched.current = true yet if we are forcing, or maybe we do? 
            // If we force, we definitely want to allow future fetches if we reset the logic, 
            // but standard logic is "fetch once on mount".
            if (!force) hasFetched.current = true;

            const tokenResponse = await instance.acquireTokenSilent({
                scopes: [import.meta.env.VITE_SCOPE],
                account: accounts[0]
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL}/GetRecipes`, {
                headers: { "Authorization": `Bearer ${tokenResponse.accessToken}` }
            });

            if (response.ok) {
                const allItems: any[] = await response.json();

                // Handle Grocery List
                const groceryItem = allItems.find(item => item.RowKey === 'GROCERY_LIST');
                if (groceryItem && groceryItem.Ingredients) {
                    try {
                        const parsed = JSON.parse(groceryItem.Ingredients);
                        if (Array.isArray(parsed)) {
                            setGroceryList(parsed);
                        }
                    } catch (e) {
                        console.error("Failed to parse grocery list ingredients:", e);
                    }
                }

                // Separate the "Mixed Bag" from Azure Table Storage
                const onlyRecipes = allItems.filter(item => item.RowKey && item.RowKey.startsWith('recipe_'));
                // Assume anything that isn't a recipe is a category (or at least metadata we want to classify as such for now)
                // Exclude GROCERY_LIST
                const onlyCategories = allItems.filter(item =>
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
        <RecipeContext.Provider value={{ recipes, categories, fetchRecipes, loading, groceryList, addToGroceryList, addIngredientsToGroceryList, removeFromGroceryList, addRecipe, deleteRecipe, deleteCategory, updateRecipe, createCategory }}>
            {children}
        </RecipeContext.Provider>
    );
};

export const useRecipes = () => useContext(RecipeContext);  