import { useRecipes } from '../Context/RecipeContext';
import { Box, Container, Typography, Grid, Card, CardContent, Divider, Chip, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CategoryIcon from '@mui/icons-material/Category';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
    const { recipes, categories } = useRecipes();
    const navigate = useNavigate();

    // 1. Get names from stored Category entities
    const storedCategoryNames = categories.map((c: any) => {
        // Prioritize parsing RowKey if it follows the known pattern "category_..."
        // This avoids issues where the 'Category' property is empty or 'Title' is missing.
        if (c.RowKey && /^(category_|Category_)/i.test(c.RowKey)) {
             return c.RowKey.replace(/^(category_|Category_)/i, '');
        }

        // Fallback to properties if RowKey doesn't match the pattern
        if (c.Name) return c.Name;
        if (c.Title) return c.Title;
        if (c.Category) return c.Category;
        
        // Final fallback
        return c.RowKey || "Unknown";
    });

    // 2. Get names from Recipes (legacy or ad-hoc categories)
    const recipeCategoryNames = recipes.map((r: any) => r.Category || "Uncategorized");

    // 3. Union and Deduplicate
    const derivedCategories = Array.from(new Set([...storedCategoryNames, ...recipeCategoryNames]))
        .filter((c: any) => c && c !== "Unknown") // Filter out invalid
        .sort((a: any, b: any) => {
            if (a === "Uncategorized") return 1;
            if (b === "Uncategorized") return -1;
            return a.localeCompare(b);
        });

    // Group Recipes by Category
    const getRecipesByCategory = (categoryName: string) => {
        return recipes.filter((r: any) => {
            const rCat = r.Category || "Uncategorized";
            return rCat === categoryName;
        });
    };

    return (
        <Box sx={{ minHeight: 'calc(100vh - 64px)', py: 4, bgcolor: 'background.default', color: 'text.primary' }}>
            <Container maxWidth="lg">
                <Typography variant="h4" fontFamily="Playfair Display" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CategoryIcon color="secondary" fontSize="large" /> Categories
                </Typography>
                <Divider sx={{ mb: 4 }} />

                {derivedCategories.length > 0 ? (
                    <Box>
                        {derivedCategories.map((categoryName: any, index: number) => {
                            const categoryRecipes = getRecipesByCategory(categoryName);
                            return (
                                <Accordion key={index} sx={{ mb: 2, bgcolor: 'background.paper' }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={`panel${index}-content`}
                                        id={`panel${index}-header`}
                                    >
                                        <Typography variant="h6" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {categoryName}
                                            <Chip label={categoryRecipes.length} size="small" color="secondary" variant="outlined" sx={{ ml: 2 }} />
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {categoryRecipes.length > 0 ? (
                                            <Grid container spacing={2}>
                                                {categoryRecipes.map((recipe: any) => (
                                                    <Grid item xs={12} sm={6} md={4} key={recipe.RowKey || recipe.Title}>
                                                        <Card variant="outlined" sx={{ '&:hover': { boxShadow: 2, cursor: 'pointer' } }} onClick={() => navigate(`/recipe/${recipe.RowKey}`)}>
                                                            <CardContent>
                                                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                                                    {recipe.Title}
                                                                </Typography>
                                                                <Button size="small" variant="text" color="secondary" onClick={(e) => { e.stopPropagation(); navigate(`/recipe/${recipe.RowKey}`); }}>View Recipe</Button>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                No recipes in this category yet.
                                            </Typography>
                                        )}
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })}
                    </Box>
                ) : (
                    <Box sx={{ py: 8, textAlign: 'center', color: 'text.secondary', border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
                        <CategoryIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                        <Typography variant="h6">No categories found</Typography>
                        <Typography variant="body2">Start by creating a recipe.</Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default Categories;
