import { useState, useEffect } from 'react'
import './App.css'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, useIsAuthenticated } from '@azure/msal-react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from './components/NavigationBar';
import Landing from './Pages/Landing'
import Home from './Pages/Home'
import { RecipeProvider } from './Context/RecipeContext.tsx'

function App() {

  const { instance } = useMsal()


  return (
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

          </Routes>
        </AuthenticatedTemplate>

      </Router >
    </RecipeProvider>

  )
}

export default App;