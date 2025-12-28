import { useMsal } from "@azure/msal-react";
import { useEffect } from 'react';
import { useRecipes } from '../Context/RecipeContext'; // 1. Import your new hook
import {
    Container, Typography, Grid, Card, CardContent,
    CardActions, Button, Box, Avatar, Divider, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const Home = () => {

    //Context fetches recipe data
    const { recipes, fetchRecipes, loading } = useRecipes();

    const { accounts } = useMsal();


    useEffect(() => {
        if (accounts.length > 0) {
            fetchRecipes();
        }
    }, [accounts]);

    const userName = accounts[0]?.name || "Chef";

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Welcome Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                    {userName.charAt(0)}
                </Avatar>
                <Box>
                    <Typography variant="h4" fontWeight="700">
                        Welcome back, {userName}!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        What are we cooking today?
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Stats Card */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'primary.light', color: 'white' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Your Kitchen</Typography>
                            <Typography variant="h3" fontWeight="bold">
                                {loading ? '...' : recipes.length}
                            </Typography>
                            <Typography variant="body2">Saved Recipes</Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" variant="contained" color="secondary" startIcon={<AddIcon />}>
                                New Recipe
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Recipe List */}
                <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <RestaurantIcon /> Recent Recipes
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {/* Load recipes */}
                    {loading ? (
                        // loading State
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {recipes.length > 0 ? recipes.map((recipe: any) => (
                                <Grid item xs={12} key={recipe.RowKey}>
                                    <Card variant="outlined">
                                        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: '12px !important' }}>

                                            <Typography fontWeight="500">{recipe.Title || recipe.title}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {recipe.Timestamp ? new Date(recipe.Timestamp).toLocaleDateString() : "Just now"}
                                            </Typography>
                                            <Button size="small">View</Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )) : (
                                <Typography sx={{ p: 2, color: 'text.secondary' }}>No recipes found in your table storage.</Typography>
                            )}
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default Home;