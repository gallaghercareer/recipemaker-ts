import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipes } from '../Context/RecipeContext';
import {
    Box, Container, Typography, Chip, Divider, Paper, List, ListItem, ListItemText, ListItemIcon, Button, Grid, IconButton,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Card
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';

const Recipe = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { recipes, fetchRecipes, loading, deleteRecipe } = useRecipes();
    const [recipe, setRecipe] = useState<any>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    useEffect(() => {
        fetchRecipes();
    }, []);

    useEffect(() => {
        if (recipes.length > 0 && id) {
            const found = recipes.find((r: any) => r.RowKey === id);
            setRecipe(found);
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
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        color="inherit"
                    >
                        Back
                    </Button>
                    <Button
                        startIcon={<DeleteIcon />}
                        color="error"
                        onClick={() => setOpenDeleteDialog(true)}
                    >
                        Delete Recipe
                    </Button>
                </Box>

                <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    {/* Header */}
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
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
                            {/* Placeholder for future metadata like Prep Time or Servings */}
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
                            <LinkIcon color="primary" />
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
                            component="span" // Since the card is clickable, button is visual aid or fallback
                        >
                            Open Link
                        </Button>
                    </Card>
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
