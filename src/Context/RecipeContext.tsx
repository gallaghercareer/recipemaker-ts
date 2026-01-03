import React, { createContext, useContext, useState, useRef } from 'react';
import { useMsal } from "@azure/msal-react";

const RecipeContext = createContext<any>(null);

export const RecipeProvider = ({ children }: { children: React.ReactNode }) => {
    const { accounts, instance } = useMsal();

    const [recipes, setRecipes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const hasFetched = useRef(false);
    const [groceryList, setGroceryList] = useState<string[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    const addToGroceryList = (ingredient: string) => {
        if (!groceryList.includes(ingredient)) {
            setGroceryList([...groceryList, ingredient]);
        }
    };

    const removeFromGroceryList = (ingredient: string) => {
        setGroceryList(groceryList.filter(item => item !== ingredient));
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

                // Separate the "Mixed Bag" from Azure Table Storage
                const onlyRecipes = allItems.filter(item => item.RowKey && item.RowKey.startsWith('recipe_'));
                const onlyCategories = allItems.filter(item => item.RowKey && item.RowKey.startsWith('category_'));

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

    return (
        <RecipeContext.Provider value={{ recipes, categories, fetchRecipes, loading, groceryList, addToGroceryList, removeFromGroceryList, addRecipe, deleteRecipe }}>
            {children}
        </RecipeContext.Provider>
    );
};

export const useRecipes = () => useContext(RecipeContext);