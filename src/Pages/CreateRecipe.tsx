import { useState } from 'react';
import {
    Box, Container, Typography, TextField, Button, Grid, Paper,
    List, ListItem, ListItemText, ListItemIcon, IconButton, Divider, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import SaveIcon from '@mui/icons-material/Save';
import LinkIcon from '@mui/icons-material/Link';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const CreateRecipe = () => {
    const [recipeName, setRecipeName] = useState('');
    const [recipeUrl, setRecipeUrl] = useState('');
    const [ingredientInput, setIngredientInput] = useState('');
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [bulkIngredients, setBulkIngredients] = useState('');

    const handleAddIngredient = () => {
        if (ingredientInput.trim()) {
            setIngredients([...ingredients, ingredientInput.trim()]);
            setIngredientInput('');
        }
    };

    const handleDeleteIngredient = (index: number) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    const handleBulkParse = () => {
        if (bulkIngredients.trim()) {
            const newItems = bulkIngredients.split(',').map(item => item.trim()).filter(item => item.length > 0);
            setIngredients([...ingredients, ...newItems]);
            setBulkIngredients(''); // Clear after adding
        }
    };

    return (
        <Box sx={{ minHeight: 'calc(100vh - 64px)', py: 4, bgcolor: 'background.default', color: 'text.primary' }}>
            <Container maxWidth="md">
                <Typography variant="h4" fontFamily="Playfair Display" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <RestaurantIcon color="secondary" fontSize="large" /> Create New Recipe
                </Typography>
                <Divider sx={{ mb: 4 }} />

                <Grid container spacing={4}>
                    {/* Left Column: Form Inputs */}
                    <Grid item xs={12} md={8}>
                        <Paper variant="outlined" sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
                            
                            {/* Recipe Name */}
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" gutterBottom fontWeight="600">Recipe Details</Typography>
                                <TextField
                                    fullWidth
                                    label="Recipe Name"
                                    variant="outlined"
                                    value={recipeName}
                                    onChange={(e) => setRecipeName(e.target.value)}
                                    sx={{ mb: 2 }}
                                    placeholder="e.g., Grandmother's Apple Pie"
                                />
                                <TextField
                                    fullWidth
                                    label="Source URL (Optional)"
                                    variant="outlined"
                                    value={recipeUrl}
                                    onChange={(e) => setRecipeUrl(e.target.value)}
                                    InputProps={{
                                        startAdornment: <LinkIcon color="action" sx={{ mr: 1 }} />
                                    }}
                                    placeholder="https://..."
                                />
                            </Box>

                            <Divider sx={{ my: 4 }} />

                            {/* Add Single Ingredient */}
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" gutterBottom fontWeight="600">Ingredients</Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Add single ingredient"
                                        value={ingredientInput}
                                        onChange={(e) => setIngredientInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient()}
                                    />
                                    <Button 
                                        variant="contained" 
                                        color="secondary" 
                                        onClick={handleAddIngredient}
                                        startIcon={<AddIcon />}
                                    >
                                        Add
                                    </Button>
                                </Box>

                                {/* Bulk Paste */}
                                <Typography variant="subtitle2" gutterBottom sx={{ mt: 3, color: 'text.secondary' }}>
                                    Or paste a list:
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    placeholder="Flour, Sugar, Eggs, Milk..."
                                    value={bulkIngredients}
                                    onChange={(e) => setBulkIngredients(e.target.value)}
                                    helperText="Use commas to separate ingredients"
                                />
                                <Button 
                                    onClick={handleBulkParse} 
                                    sx={{ mt: 1 }} 
                                    disabled={!bulkIngredients.trim()}
                                >
                                    Parse & Add
                                </Button>
                            </Box>
                        </Paper>
                        
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                             <Button 
                                variant="contained" 
                                color="primary" 
                                size="large"
                                startIcon={<SaveIcon />}
                                sx={{ px: 4, py: 1.5, borderRadius: 8 }}
                            >
                                Save Recipe
                            </Button>
                        </Box>
                    </Grid>

                    {/* Right Column: Preview/List */}
                    <Grid item xs={12} md={4}>
                         <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                            <Typography variant="h6" fontFamily="Playfair Display" gutterBottom>
                                Ingredient List
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {ingredients.length} items added
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            {ingredients.length > 0 ? (
                                <List dense>
                                    {ingredients.map((ingredient, index) => (
                                        <ListItem 
                                            key={index}
                                            secondaryAction={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <IconButton 
                                                        aria-label="add to grocery" 
                                                        size="small" 
                                                        sx={{ 
                                                            mr: 1,
                                                            '&:hover': {
                                                                color: 'success.main',
                                                                backgroundColor: 'rgba(46, 125, 50, 0.1)'
                                                            }
                                                        }}
                                                    >
                                                        <ShoppingBasketIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton 
                                                        edge="end" 
                                                        aria-label="delete" 
                                                        size="small" 
                                                        onClick={() => handleDeleteIngredient(index)}
                                                        sx={{ 
                                                            '&:hover': { 
                                                                color: 'error.main',
                                                                bgcolor: 'error.light',
                                                                // or use transparent red
                                                                backgroundColor: 'rgba(211, 47, 47, 0.1)'
                                                            } 
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            }
                                            sx={{ 
                                                bgcolor: 'background.default', 
                                                mb: 1, 
                                                borderRadius: 1,
                                                border: '1px solid',
                                                borderColor: 'divider'
                                            }}
                                        >
                                            <ListItemText 
                                                primary={ingredient} 
                                                primaryTypographyProps={{ 
                                                    style: { 
                                                        whiteSpace: 'normal', 
                                                        wordBreak: 'break-word' 
                                                    } 
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary', border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
                                    <Typography variant="body2">No ingredients yet.</Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default CreateRecipe;