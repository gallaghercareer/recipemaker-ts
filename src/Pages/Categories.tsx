import { useState } from 'react';
import { useRecipes } from '../Context/RecipeContext';
import { Box, Container, Typography, Grid, Card, CardContent, Divider, Chip, Button, Accordion, AccordionSummary, AccordionDetails, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CategoryIcon from '@mui/icons-material/Category';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
    const { recipes, categories, deleteCategory, createCategory } = useRecipes();
    const navigate = useNavigate();
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // 1. Get names from stored Category entities (The Markers)
    const storedCategoryNames = categories.map((c: any) => {
        if (c.RowKey && /^(category_|Category_)/i.test(c.RowKey)) {
            return c.RowKey.replace(/^(category_|Category_)/i, '');
        }
        if (c.Name) return c.Name;
        if (c.Title) return c.Title;
        if (c.Category) return c.Category;
        return c.RowKey || "Unknown";
    }).filter((c: any) => c && c !== "Unknown");

    // 2. Identify Valid Categories (Markers)
    const validCategories = new Set(storedCategoryNames);

    // 3. Determine if there are any "Uncategorized" recipes
    // A recipe is Uncategorized if it has no category OR its category is not in the valid markers list
    const hasUncategorized = recipes.some((r: any) => {
        const cat = r.Category;
        return !cat || !validCategories.has(cat);
    });

    // 4. Final Display List
    const displayCategories = [...Array.from(validCategories).sort()];
    if (hasUncategorized) {
        displayCategories.push("Uncategorized");
    }

    // Group Recipes by Category
    const getRecipesByCategory = (categoryName: string) => {
        if (categoryName === "Uncategorized") {
            return recipes.filter((r: any) => {
                const cat = r.Category;
                // Include if empty OR not in valid markers
                return !cat || !validCategories.has(cat);
            });
        }
        return recipes.filter((r: any) => r.Category === categoryName);
    };

    const handleDeleteCategory = async (e: React.MouseEvent, categoryName: string) => {
        e.stopPropagation(); // Prevent accordion expansion
        if (window.confirm(`Are you sure you want to delete '${categoryName}'? All recipes in this category will be moved to 'Uncategorized'.`)) {
            await deleteCategory(categoryName);
        }
    };

    const handleCreateCategory = async () => {
        if (newCategoryName.trim()) {
            await createCategory(newCategoryName.trim());
            setNewCategoryName('');
            setOpenCreateDialog(false);
        }
    };

    return (
        <Box sx={{ minHeight: 'calc(100vh - 64px)', py: 4, bgcolor: 'background.default', color: 'text.primary' }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" fontFamily="Playfair Display" fontWeight="700" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CategoryIcon color="secondary" fontSize="large" /> Categories
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenCreateDialog(true)}
                    >
                        New Category
                    </Button>
                </Box>
                <Divider sx={{ mb: 4 }} />

                {displayCategories.length > 0 ? (
                    <Box>
                        {displayCategories.map((categoryName: any, index: number) => {
                            const categoryRecipes = getRecipesByCategory(categoryName);
                            return (
                                <Accordion key={index} sx={{ mb: 2, bgcolor: 'background.paper' }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={`panel${index}-content`}
                                        id={`panel${index}-header`}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mr: 2 }}>
                                            <Typography variant="h6" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {categoryName}
                                                <Chip label={categoryRecipes.length} size="small" color="secondary" variant="outlined" sx={{ ml: 2 }} />
                                            </Typography>
                                            {categoryName !== "Uncategorized" && (
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={(e) => handleDeleteCategory(e, categoryName)}
                                                    aria-label="delete category"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </Box>
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
                        <Typography variant="body2">Start by creating a recipe or adding a new category.</Typography>
                    </Box>
                )}

                <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
                    <DialogTitle>Create New Category</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Category Name"
                            fullWidth
                            variant="standard"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleCreateCategory()}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
                        <Button onClick={handleCreateCategory} variant="contained" color="secondary">Create</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default Categories;
