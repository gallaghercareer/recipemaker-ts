import {
    Box, Container, Typography, Grid, Card, CardContent, Divider, Chip, Button
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useRecipes } from '../Context/RecipeContext';

const ViewRecipes = () => {
    const { recipes } = useRecipes();

    return (
        <Box sx={{ minHeight: 'calc(100vh - 64px)', py: 4, bgcolor: 'background.default', color: 'text.primary' }}>
            <Container maxWidth="lg">
                <Typography variant="h4" fontFamily="Playfair Display" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <RestaurantIcon color="secondary" fontSize="large" /> My Recipes
                </Typography>
                <Divider sx={{ mb: 4 }} />

                {recipes.length > 0 ? (
                    <Grid container spacing={3}>
                        {recipes.map((recipe: any) => (
                            <Grid item xs={12} sm={6} md={4} key={recipe.RowKey}>
                                <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', '&:hover': { boxShadow: 4, borderColor: 'secondary.main' } }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="div" gutterBottom fontFamily="Playfair Display" fontWeight="600">
                                            {recipe.Title || recipe.title}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'text.secondary' }}>
                                            <AccessTimeIcon fontSize="small" />
                                            <Typography variant="caption">
                                                Added {recipe.Timestamp ? new Date(recipe.Timestamp).toLocaleDateString() : "Just now"}
                                            </Typography>
                                        </Box>

                                        {recipe.Ingredients && recipe.Ingredients.length > 0 && (
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                                    Ingredients:
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {recipe.Ingredients.slice(0, 3).map((ing: string, i: number) => (
                                                        <Chip key={i} label={ing} size="small" variant="outlined" />
                                                    ))}
                                                    {recipe.Ingredients.length > 3 && (
                                                        <Chip label={`+${recipe.Ingredients.length - 3} more`} size="small" variant="outlined" />
                                                    )}
                                                </Box>
                                            </Box>
                                        )}
                                    </CardContent>
                                    <Box sx={{ p: 2, pt: 0 }}>
                                        <Button size="small" variant="contained" color="secondary" fullWidth>
                                            View Details
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box sx={{ py: 8, textAlign: 'center', color: 'text.secondary', border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
                        <RestaurantIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                        <Typography variant="h6">No recipes saved yet</Typography>
                        <Typography variant="body2">Create a new recipe to see it here.</Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default ViewRecipes;
