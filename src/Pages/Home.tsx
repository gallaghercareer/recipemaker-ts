import { useMsal } from "@azure/msal-react";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Box,
    Avatar,
    Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const Home = () => {
    const { accounts } = useMsal();

    // Get the user's name from the MSAL account object
    const userName = accounts[0]?.name || "Chef";

    // Placeholder data for your recipes
    const recentRecipes = [
        { id: 1, title: "Spaghetti Carbonara", date: "2 days ago" },
        { id: 2, title: "Avocado Toast", date: "Yesterday" },
        { id: 3, title: "Homemade Pizza", date: "Just now" },
    ];

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
                {/* Stats / Quick Actions */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'primary.light', color: 'white' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Your Kitchen</Typography>
                            <Typography variant="h3" fontWeight="bold">12</Typography>
                            <Typography variant="body2">Saved Recipes</Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" variant="contained" color="secondary" startIcon={<AddIcon />}>
                                New Recipe
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Recent Activity List */}
                <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <RestaurantIcon /> Recent Recipes
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        {recentRecipes.map((recipe) => (
                            <Grid item xs={12} key={recipe.id}>
                                <Card variant="outlined">
                                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: '12px !important' }}>
                                        <Typography fontWeight="500">{recipe.title}</Typography>
                                        <Typography variant="caption" color="text.secondary">{recipe.date}</Typography>
                                        <Button size="small">View</Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Home;