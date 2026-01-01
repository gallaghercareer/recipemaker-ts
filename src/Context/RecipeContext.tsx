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

    const addRecipe = (newRecipe: any) => {
        setRecipes((prevRecipes: any) => [newRecipe, ...prevRecipes]);
    };


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

            const response = await fetch(import.meta.env.VITE_API_URL, {
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

            console.log(error); // Reset on error so we can retry
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