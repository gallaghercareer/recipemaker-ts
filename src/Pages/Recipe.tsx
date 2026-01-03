import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipes } from '../Context/RecipeContext';
import {
    Box, Container, Typography, Chip, Divider, Paper, List, ListItem, ListItemText, ListItemIcon, Button, Grid, IconButton,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Card, TextField, Autocomplete
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

const Recipe = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { recipes, categories, fetchRecipes, loading, deleteRecipe, updateRecipe } = useRecipes();
    const [recipe, setRecipe] = useState<any>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const categoryOptions = useMemo(() => {
        const names = categories.map((c: any) => {
            if (c.RowKey && /^(category_|Category_)/i.test(c.RowKey)) {
                 return c.RowKey.replace(/^(category_|Category_)/i, '');
            }
            if (c.Name) return c.Name;
            if (c.Title) return c.Title;
            if (c.Category) return c.Category;
            return c.RowKey || "Unknown";
        }).filter((c: any) => c && c !== "Unknown");
        
        return Array.from(new Set(names)).sort();
    }, [categories]);

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        Title: '',
        Category: '',
        Url: '',
        Steps: ''
    });
    // Ingredient Management State for Edit Mode
    const [editingIngredients, setEditingIngredients] = useState<string[]>([]);
    const [ingredientInput, setIngredientInput] = useState('');
    const [bulkIngredients, setBulkIngredients] = useState('');

    useEffect(() => {
        fetchRecipes();
    }, []);

    useEffect(() => {
        if (recipes.length > 0 && id) {
            const found = recipes.find((r: any) => r.RowKey === id);
            setRecipe(found);
            // Initialize edit data
            if (found) {
                const ing = parseList(found.Ingredients);
                const stp = parseList(found.Steps);
                setEditData({
                    Title: found.Title,
                    Category: found.Category,
                    Url: found.Url || '',
                    Steps: stp.join('\n')
                });
                setEditingIngredients(ing);
            }
        }
    }, [recipes, id]);

    const parseList = (data: any): string[] => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed)) return parsed;
            } catch (e) {
                return data.split('\n').map(s => s.trim()).filter(s => s.length > 0);
            }
        }
        return [];
    };

    const handleDelete = async () => {
        if (recipe && recipe.RowKey) {
            const success = await deleteRecipe(recipe.RowKey);
            if (success) {
                navigate('/recipes');
            } else {
                alert("Failed to delete recipe.");
            }
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        // Reset data
        if (recipe) {
            const ing = parseList(recipe.Ingredients);
            const stp = parseList(recipe.Steps);
            setEditData({
                Title: recipe.Title,
                Category: recipe.Category,
                Url: recipe.Url || '',
                Steps: stp.join('\n')
            });
            setEditingIngredients(ing);
        }
    };

    // Ingredient Handlers for Edit Mode
    const handleAddIngredient = () => {
        if (ingredientInput.trim()) {
            setEditingIngredients([...editingIngredients, ingredientInput.trim()]);
            setIngredientInput('');
        }
    };

    const handleDeleteIngredient = (index: number) => {
        const newIngredients = editingIngredients.filter((_, i) => i !== index);
        setEditingIngredients(newIngredients);
    };

    const handleBulkParse = () => {
        if (bulkIngredients.trim()) {
            const newItems = bulkIngredients.split(',').map(item => item.trim()).filter(item => item.length > 0);
            setEditingIngredients([...editingIngredients, ...newItems]);
            setBulkIngredients('');
        }
    };

    const handleSaveClick = async () => {
        if (!recipe) return;

        const updatedRecipe = {
            ...recipe, // Keep original fields like RowKey, PartitionKey
            Title: editData.Title,
            Category: editData.Category,
            Url: editData.Url,
            Ingredients: JSON.stringify(editingIngredients),
            Steps: JSON.stringify(editData.Steps.split('\n').filter(s => s.trim().length > 0))
        };

        const success = await updateRecipe(updatedRecipe);
        if (success) {
            setIsEditing(false);
            // setRecipe will be updated by fetchRecipes in context
        } else {
            alert("Failed to update recipe.");
        }
    };

    if (loading && !recipe) {
        return (
            <Box sx={{ minHeight: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography>Loading recipe...</Typography>
            </Box>
        );
    }

    if (!recipe && !loading && recipes.length > 0) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>Recipe not found</Typography>
                <Button variant="outlined" onClick={() => navigate('/recipes')}>Back to Recipes</Button>
            </Container>
        );
    }

    if (!recipe) return null;

    const ingredients = parseList(recipe.Ingredients);
    const steps = parseList(recipe.Steps);

    return (
        <Box sx={{ minHeight: 'calc(100vh - 64px)', py: 4, bgcolor: 'background.default', color: 'text.primary' }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    {isEditing ? (
                        <Button
                            startIcon={<CloseIcon />}
                            onClick={handleCancelClick}
                            color="inherit"
                        >
                            Cancel
                        </Button>
                    ) : (
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(-1)}
                            color="inherit"
                        >
                            Back
                        </Button>
                    )}

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {isEditing ? (
                            <Button
                                startIcon={<SaveIcon />}
                                variant="contained"
                                color="secondary"
                                onClick={handleSaveClick}
                            >
                                Save Recipe
                            </Button>
                        ) : (
                            <>
                                <Button
                                    startIcon={<EditIcon />}
                                    color="primary"
                                    onClick={handleEditClick}
                                >
                                    Edit
                                </Button>
                                <Button
                                    startIcon={<DeleteIcon />}
                                    color="error"
                                    onClick={() => setOpenDeleteDialog(true)}
                                >
                                    Delete
                                </Button>
                            </>
                        )}
                    </Box>
                </Box>

                {isEditing ? (
                    // Edit Mode Layout (mimicking CreateRecipe)
                    <Grid container spacing={4}>
                        {/* Left Column: Form Inputs */}
                        <Grid item xs={12} md={7}>
                            <Paper variant="outlined" sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
                                {/* Recipe Details */}
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h6" gutterBottom fontWeight="600">Recipe Details</Typography>
                                    <TextField
                                        label="Recipe Name"
                                        variant="outlined"
                                        value={editData.Title}
                                        onChange={(e) => setEditData({ ...editData, Title: e.target.value })}
                                        fullWidth
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        label="Source URL"
                                        variant="outlined"
                                        value={editData.Url}
                                        onChange={(e) => setEditData({ ...editData, Url: e.target.value })}
                                        fullWidth
                                        InputProps={{
                                            startAdornment: <LinkIcon color="action" sx={{ mr: 1 }} />
                                        }}
                                        sx={{ mb: 2 }}
                                    />
                                    <Autocomplete
                                        freeSolo
                                        options={categoryOptions}
                                        value={editData.Category}
                                        onChange={(event: any, newValue: string | null) => {
                                            setEditData({ ...editData, Category: newValue || '' });
                                        }}
                                        onInputChange={(event, newInputValue) => {
                                            setEditData({ ...editData, Category: newInputValue });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Category"
                                                variant="outlined"
                                                fullWidth
                                            />
                                        )}
                                    />
                                </Box>

                                <Divider sx={{ my: 4 }} />

                                {/* Ingredients Management */}
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
                                        variant="contained"
                                        color="secondary"
                                        disabled={!bulkIngredients.trim()}
                                    >
                                        List Add+
                                    </Button>
                                </Box>

                                <Divider sx={{ my: 4 }} />

                                {/* Preparation Steps */}
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h6" gutterBottom fontWeight="600">Preparation Steps</Typography>
                                    <TextField
                                        multiline
                                        minRows={6}
                                        fullWidth
                                        variant="outlined"
                                        placeholder="1. Preheat oven to 350°F..."
                                        value={editData.Steps}
                                        onChange={(e) => setEditData({ ...editData, Steps: e.target.value })}
                                        helperText="Describe how to prepare this dish"
                                    />
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Right Column: Ingredient Preview */}
                        <Grid item xs={12} md={5}>
                            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                <Typography variant="h6" fontFamily="Playfair Display" gutterBottom>
                                    Ingredient List
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {editingIngredients.length} items added
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                {editingIngredients.length > 0 ? (
                                    <List dense>
                                        {editingIngredients.map((ingredient, index) => (
                                            <ListItem
                                                key={index}
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
                                                        style: { whiteSpace: 'normal', wordBreak: 'break-word' }
                                                    }}
                                                    sx={{ mr: 2, my: 0.5 }}
                                                />
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    size="small"
                                                    onClick={() => handleDeleteIngredient(index)}
                                                    sx={{
                                                        '&:hover': {
                                                            color: 'error.main',
                                                            bgcolor: 'rgba(211, 47, 47, 0.1)'
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
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
                ) : (
                    // View Mode Layout
                    <>
                        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                            {/* Header */}
                            <Box sx={{ mb: 4, textAlign: 'center' }}>
                                {/* ... (Existing View Header) ... */}
                                {/* Wait, the replace string needs to match exactly or I replace the whole return */}
                                {/* The logic below is simpler: I am replacing everything from `const Recipe = ...` down to the end of the return statement for `Recipe` component. */}
                                {/* BUT replace tool requires context. I will provide a large chunk of the file or reconstruct the view mode inside the replace string. */}
                                {/* Since I am replacing the entire component logic and return, I should be careful. */}
                                {/* Actually, I am providing a HUGE new string. I need to make sure I match the old string correctly. */}
                                {/* The safest way is to replace the main `Recipe` component function body. */}
                                <Typography variant="overline" color="secondary" fontWeight="bold" letterSpacing={2}>
                                    {recipe.Category || "Uncategorized"}
                                </Typography>
                                <Typography variant="h3" fontFamily="Playfair Display" fontWeight="700" gutterBottom>
                                    {recipe.Title}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, color: 'text.secondary', mt: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <AccessTimeIcon fontSize="small" />
                                        <Typography variant="body2">
                                            {recipe.Timestamp ? new Date(recipe.Timestamp).toLocaleDateString() : "Recently Added"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 4 }} />

                            <Grid container spacing={4}>
                                {/* Ingredients Column */}
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ bgcolor: 'action.hover', p: 3, borderRadius: 2, height: '100%' }}>
                                        <Typography variant="h5" fontFamily="Playfair Display" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LocalDiningIcon color="secondary" /> Ingredients
                                        </Typography>
                                        <List>
                                            {ingredients.map((item, index) => (
                                                <ListItem key={index} disablePadding sx={{ py: 1 }}>
                                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                                        <CheckCircleOutlineIcon fontSize="small" color="secondary" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                                                </ListItem>
                                            ))}
                                            {ingredients.length === 0 && (
                                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                    No ingredients listed.
                                                </Typography>
                                            )}
                                        </List>
                                    </Box>
                                </Grid>

                                {/* Instructions Column */}
                                <Grid item xs={12} md={8}>
                                    <Box sx={{ p: 3 }}>
                                        <Typography variant="h5" fontFamily="Playfair Display" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <RestaurantIcon color="secondary" /> Instructions
                                        </Typography>
                                        <List sx={{ counterReset: 'step-counter' }}>
                                            {steps.map((step, index) => (
                                                <ListItem key={index} alignItems="flex-start" sx={{ mb: 2 }}>
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            mr: 2,
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: '50%',
                                                            bgcolor: 'secondary.main',
                                                            color: 'secondary.contrastText',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '0.875rem',
                                                            fontWeight: 'bold',
                                                            flexShrink: 0,
                                                            mt: 0.5
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </Box>
                                                    <ListItemText primary={step} />
                                                </ListItem>
                                            ))}
                                            {steps.length === 0 && (
                                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                    No instructions listed.
                                                </Typography>
                                            )}
                                        </List>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>

                        {recipe.Url && (
                            <Card
                                variant="outlined"
                                onClick={() => window.open(recipe.Url, "_blank")}
                                sx={{
                                    mt: 3,
                                    p: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                        borderColor: 'primary.main'
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <LinkIcon color="secondary" />
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            Original Source
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                                            {recipe.Url}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color="secondary"
                                    component="span"
                                >
                                    Open Link
                                </Button>
                            </Card>
                        )}
                    </>
                )}
                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Delete this recipe?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete <strong>{recipe.Title}</strong>? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">
                            Cancel
                        </Button>
                        <Button onClick={handleDelete} color="error" autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default Recipe;
