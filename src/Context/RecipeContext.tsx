import React, { createContext, useContext, useState, useRef } from 'react';
import { useMsal } from "@azure/msal-react";

const RecipeContext = createContext<any>(null);

export const RecipeProvider = ({ children }: { children: React.ReactNode }) => {
    const { accounts, instance } = useMsal();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const hasFetched = useRef(false);

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
            hasFetched.current = false; // Reset on error so we can retry
            console.error("Context Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <RecipeContext.Provider value={{ recipes, fetchRecipes, loading }}>
            {children}
        </RecipeContext.Provider>
    );
};

export const useRecipes = () => useContext(RecipeContext);