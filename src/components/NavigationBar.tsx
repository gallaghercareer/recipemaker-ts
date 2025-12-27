import { AppBar, Toolbar, Button, Stack, Box, ButtonGroup } from '@mui/material'
import { loginRequest } from '../Config/Auth';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';


function NavigationBar() {


    const { instance } = useMsal();

    const handleLoginRedirect = async () => {

        instance.loginRedirect(loginRequest).catch((error) => console.log(error));
    };

    const handleLogoutRedirect = async () => {
        instance.logoutRedirect().catch((error) => console.log(error));
    };



    return (
        <AppBar position="sticky" >
            <Toolbar >
                <Box width="100%" sx={{}}>
                    <Stack gap={5} flexDirection="row" justifyContent="flex-end" >

                        <ButtonGroup sx={{ display: 'flex', alignItems: "center" }}>


                            <AuthenticatedTemplate>
                                <Button onClick={handleLogoutRedirect} sx={{ color: 'white', fontSize: 25 }}>Sign Out</Button>
                            </AuthenticatedTemplate>
                            <UnauthenticatedTemplate>
                                <Button onClick={handleLoginRedirect} sx={{ color: 'white', fontSize: 25 }}>Sign In</Button>
                            </UnauthenticatedTemplate>


                        </ButtonGroup>

                    </Stack>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default NavigationBar