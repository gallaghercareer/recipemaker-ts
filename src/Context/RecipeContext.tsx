import React, { createContext, useContext, useState, useRef } from 'react';
import { useMsal } from "@azure/msal-react";

const RecipeContext = createContext<any>(null);

export const RecipeProvider = ({ children }: { children: React.ReactNode }) => {
    const { accounts, instance } = useMsal();
    
    const [recipes, setRecipes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const hasFetched = useRef(false);
    const [groceryList, setGroceryList] = useState<string[]>([]);

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

            // 1. Get the token for the API call
            const tokenResponse = await instance.acquireTokenSilent({
                scopes: [import.meta.env.VITE_SCOPE],
                account: accounts[0]
            });

            // 2. POST to your Azure Function
            const response = await fetch(`${import.meta.env.VITE_API_URL}/CreateRecipe`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${tokenResponse.accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newRecipe)
            });

            if (response.ok) {
                const savedRecipe = await response.json();
                // 3. Update local state so the UI reflects the change immediately
                setRecipes((prev: any[]) => [savedRecipe, ...prev]);
                return true;
            } else {
                console.error("Failed to save recipe to Azure");
                return false;
            }
        } catch (error) {
            console.error("Error in addRecipe:", error);
            return false;
        } finally {
            setLoading(false);
        }
    }


    const fetchRecipes = async () => {
        // Guard: Don't fetch if already fetching or if we already have data
        if (hasFetched.current || accounts.length === 0) return;

        try {
            setLoading(true);
            hasFetched.current = true;

            const tokenResponse = await instance.acquireTokenSilent({
                scopes: [import.meta.env.VITE_SCOPE],
                account: accounts[0]
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL}/GetRecipes`, {
                headers: { "Authorization": `Bearer ${tokenResponse.accessToken}` }
            });
            // Check if the server actually sent data back
            if (response.ok) {
                const data = await response.json();
                setRecipes(data);
            } else {
                // If it's a 401, this will now log properly instead of crashing
                console.error(`Backend returned ${response.status}: ${response.statusText}`);
                hasFetched.current = false;
            }
        } catch (error) {
             hasFetched.current = false;
            console.error(error); // Reset on error so we can retry
        } finally {
            setLoading(false);
        }
    };

    return (
        <RecipeContext.Provider value={{ recipes, fetchRecipes, loading, groceryList, addToGroceryList, removeFromGroceryList, addRecipe }}>
            {children}
        </RecipeContext.Provider>
    );
};

export const useRecipes = () => useContext(RecipeContext);