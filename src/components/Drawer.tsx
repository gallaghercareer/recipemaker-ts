import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CategoryIcon from '@mui/icons-material/Category';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { useIsAuthenticated } from "@azure/msal-react";

/*Notes:

*/

export default function TemporaryDrawer() {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };
    const isAuthenticated = useIsAuthenticated();


    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            {/* SECTION 1: Portfolio & External Links */}
            <List>
                <ListItem disablePadding>
                    <ListItemButton component="a" href="https://gallaghercareer.github.io/portfolio-2025/#portfolio" target="">
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText primary="Back to Portfolio" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton component="a" href="https://drive.google.com/file/d/1wke4lwAjcOIoF0oSzwb-AD7CfxHB4E6P/view?usp=sharing" target="_blank">
                        <ListItemIcon><InboxIcon /></ListItemIcon>
                        <ListItemText primary="App Diagram" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton component="a" href="https://docs.google.com/document/d/11eorTSFoyTShaZlh9kUCtOeR4Je7WpJZji_dqIuKDw8/edit?usp=sharing" target="_blank">
                        <ListItemIcon><MailIcon /></ListItemIcon>
                        <ListItemText primary="Contact Me" />
                    </ListItemButton>
                </ListItem>
            </List>

            <Divider />

            {/* SECTION 2: App Navigation (Conditional) */}
            <List>
                {!isAuthenticated ? (
                    // Public Links
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate('/')}>
                            <ListItemIcon><HomeIcon /></ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </ListItem>
                ) : (
                    // Authenticated Links
                    <>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => navigate('/Home')}>
                                <ListItemIcon><HomeIcon /></ListItemIcon>
                                <ListItemText primary="Home" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton onClick={() => navigate('/create-recipe')}>
                                <ListItemIcon><RestaurantIcon /></ListItemIcon>
                                <ListItemText primary="Create Recipe" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton onClick={() => navigate('/recipes')}>
                                <ListItemIcon><RestaurantIcon /></ListItemIcon>
                                <ListItemText primary="My Recipes" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton onClick={() => navigate('/categories')}>
                                <ListItemIcon><CategoryIcon /></ListItemIcon>
                                <ListItemText primary="Categories" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton onClick={() => navigate('/groceries')}>
                                <ListItemIcon><LocalGroceryStoreIcon /></ListItemIcon>
                                <ListItemText primary="Grocery List" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    );

    return (
        <React.Fragment>
            <IconButton onClick={toggleDrawer(true)} color="inherit">
                <MenuIcon />
            </IconButton>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </React.Fragment>
    );
}
