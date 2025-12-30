import { AppBar, Toolbar, Button, Box, ButtonGroup, IconButton, useTheme } from '@mui/material'
import { loginRequest } from '../Config/Auth';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import Drawer from './Drawer'
import { useContext } from 'react';
import { ColorModeContext } from '../Context/ColorModeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

function NavigationBar() {


    const { instance } = useMsal();
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const navigate = useNavigate();

    const handleLoginRedirect = async () => {
        const customRequest = {
            ...loginRequest,
            // Vite will swap this value at build time
            redirectUri: import.meta.env.VITE_REDIRECT_URI
        };

        instance.loginRedirect(customRequest).catch((error) => console.log(error));
    };

    const handleLogoutRedirect = async () => {
        instance.logoutRedirect({
            postLogoutRedirectUri: import.meta.env.VITE_LOGOUT_REDIRECT_URI,
        }).catch((error) => console.log(error));
    };


    return (
        <AppBar position="sticky" >
            <Toolbar >
                <Box width="100%" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Drawer />
                    <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                    <AuthenticatedTemplate>
                        <IconButton sx={{ ml: 1 }} onClick={() => navigate('/Home')} color="inherit">
                            <HomeIcon />
                        </IconButton>
                        <ButtonGroup sx={{ display: 'flex', alignItems: "center", marginLeft: 'auto' }}>
                            <Button onClick={handleLogoutRedirect} color="inherit" sx={{ fontSize: 25 }}>Sign Out</Button>
                        </ButtonGroup>
                    </AuthenticatedTemplate>

                    <UnauthenticatedTemplate>
                        <ButtonGroup sx={{ display: 'flex', alignItems: "center", marginLeft: 'auto' }}>
                            <Button onClick={handleLoginRedirect} color="inherit" sx={{ fontSize: 25 }}>Sign In</Button>
                        </ButtonGroup>
                    </UnauthenticatedTemplate>
                </Box>
            </Toolbar>
        </AppBar >
    )
}

export default NavigationBar