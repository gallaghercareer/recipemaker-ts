import './App.css'
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from './components/NavigationBar';
import Landing from './Pages/Landing'
import Home from './Pages/Home'
import CreateRecipe from './Pages/CreateRecipe'
import Groceries from './Pages/Groceries'
import ViewRecipes from './Pages/ViewRecipes'
import Recipe from './Pages/Recipe'
import Categories from './Pages/Categories'
import { RecipeProvider } from './Context/RecipeContext.tsx'
import { useState, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline, type PaletteMode } from '@mui/material';
import { ColorModeContext } from './Context/ColorModeContext';
import { getDesignTokens } from './Styles/theme';

function App() {
  const [mode, setMode] = useState<PaletteMode>('light');

  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  // Update the theme only if the mode changes
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RecipeProvider>
          <Router>
            <NavigationBar />

            {/*Landing page for all users before login*/}
            <UnauthenticatedTemplate>
              <Routes>
                <Route path="/" element={<Landing />} />
              </Routes>
            </UnauthenticatedTemplate>

            {/*Homepage for authenticated users*/}
            <AuthenticatedTemplate>

              <Routes>
                <Route path="/Home" element={<Home />} />
                <Route path="/create-recipe" element={<CreateRecipe />} />
                <Route path="/groceries" element={<Groceries />} />
                <Route path="/recipes" element={<ViewRecipes />} />
                <Route path="/recipe/:id" element={<Recipe />} />
                <Route path="/categories" element={<Categories />} />
              </Routes>
            </AuthenticatedTemplate>

          </Router >
        </RecipeProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App;