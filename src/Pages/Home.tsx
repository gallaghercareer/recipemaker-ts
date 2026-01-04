import { useMsal } from "@azure/msal-react";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '../Context/RecipeContext'; // 1. Import your new hook
import {
    Container, Typography, Grid, Card, CardContent,
    Button, Box, Avatar, Divider, CircularProgress, Paper
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CategoryIcon from '@mui/icons-material/Category';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Home = () => {

    //Context fetches recipe data
    const { recipes, fetchRecipes, loading } = useRecipes();

    const { accounts } = useMsal();
    const navigate = useNavigate();


    useEffect(() => {
        if (accounts.length > 0) {
            fetchRecipes();
        }
    }, [accounts]);

    const account = accounts[0];
    const name = account?.name;
    const idTokenClaims = account?.idTokenClaims as any;
    const email = idTokenClaims?.email || idTokenClaims?.emails?.[0] || account?.username;

    const userName = (name && name !== "Unknown") ? name : (email || "Chef");

    const ActionCard = ({ title, icon, onClick }: { title: string, icon: React.ReactNode, onClick?: () => void }) => (
        <Card
            variant="outlined"
            sx={{
                height: 180,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                    borderColor: 'secondary.main'
                },
                bgcolor: 'background.paper'
            }}
            onClick={onClick}
        >
            <Box sx={{ color: 'secondary.main', mb: 2 }}>
                {icon}
            </Box>
            <Typography variant="h6" fontFamily="Playfair Display" fontWeight="600">
                {title}
            </Typography>
        </Card>
    );

    return (
        <Box sx={{ minHeight: 'calc(100vh - 64px)', py: 4, bgcolor: 'background.default', color: 'text.primary' }}>
            <Container maxWidth="lg">
                {/* Welcome Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 6, gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, color: 'primary.contrastText' }}>
                        {userName.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="700" fontFamily="Playfair Display">
                            Welcome back, {userName}!
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            What are we cooking today?
                        </Typography>
                    </Box>
                </Box>

                <Grid container spacing={6}>
                    {/* Left Side - Quick Actions 2x2 Grid */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom fontFamily="Playfair Display" sx={{ mb: 3 }}>
                            Quick Actions
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <ActionCard
                                    title="New Recipe"
                                    icon={<AddCircleOutlineIcon sx={{ fontSize: 40 }} />}
                                    onClick={() => navigate('/create-recipe')}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <ActionCard
                                    title="Categories"
                                    icon={<CategoryIcon sx={{ fontSize: 40 }} />}
                                    onClick={() => navigate('/categories')}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <ActionCard
                                    title="Groceries"
                                    icon={<LocalGroceryStoreIcon sx={{ fontSize: 40 }} />}
                                    onClick={() => navigate('/groceries')}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <ActionCard
                                    title="Recipes"
                                    icon={<ShuffleIcon sx={{ fontSize: 40 }} />}
                                    onClick={() => navigate('/recipes')}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Right Side - Recent Recipes List */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                height: '100%',
                                minHeight: 400
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6" fontFamily="Playfair Display" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <RestaurantIcon color="secondary" /> Recent Recipes
                                </Typography>
                                {/*} <Button size="small" color="secondary">View All</Button>*/}
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            {/* Load recipes */}
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                    <CircularProgress color="secondary" />
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {recipes.length > 0 ? recipes.slice(0, 5).map((recipe: any, index: number) => ( // Limit to 5 recent
                                        <Card key={recipe.RowKey || index} variant="outlined" sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                                            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: '16px !important' }}>
                                                <Box>
                                                    <Typography fontWeight="600">{recipe.Title || recipe.title}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Added {recipe.Timestamp ? new Date(recipe.Timestamp).toLocaleDateString() : "Just now"}
                                                    </Typography>
                                                </Box>
                                                <Button size="small" color="secondary" variant="outlined" onClick={() => navigate(`/recipe/${recipe.RowKey}`)}>Open</Button>
                                            </CardContent>
                                        </Card>
                                    )) : (
                                        <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                            <Typography>No recipes found.</Typography>
                                            <Typography variant="caption">Start by creating a new one!</Typography>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Home;