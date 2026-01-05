import {
    Box, Container, Typography, List, ListItem, ListItemText, IconButton, Divider, Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import { useRecipes } from '../Context/RecipeContext';

const Groceries = () => {
    const { groceryList, removeGroceryItemByIndex } = useRecipes();

    return (
        <Box sx={{ minHeight: 'calc(100vh - 64px)', py: 4, bgcolor: 'background.default', color: 'text.primary' }}>
            <Container maxWidth="md">
                <Typography variant="h4" fontFamily="Playfair Display" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocalGroceryStoreIcon color="secondary" fontSize="large" /> Grocery List
                </Typography>
                <Divider sx={{ mb: 4 }} />

                <Paper variant="outlined" sx={{ p: 0, bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden' }}>
                    {groceryList.length > 0 ? (
                        <List sx={{ p: 0 }}>
                            {groceryList.map((item: string, index: number) => (
                                <Box key={index}>
                                    <ListItem
                                        sx={{
                                            py: 2,
                                            px: 3,
                                            '&:hover': { bgcolor: 'action.hover' }
                                        }}
                                        secondaryAction={
                                            <IconButton 
                                                edge="end" 
                                                aria-label="delete" 
                                                onClick={() => removeGroceryItemByIndex(index)}
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText 
                                            primary={item} 
                                            primaryTypographyProps={{ fontSize: '1.1rem' }}
                                        />
                                    </ListItem>
                                    {index < groceryList.length - 1 && <Divider />}
                                </Box>
                            ))}
                        </List>
                    ) : (
                        <Box sx={{ py: 8, textAlign: 'center', color: 'text.secondary' }}>
                            <LocalGroceryStoreIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                            <Typography variant="h6">Your list is empty</Typography>
                            <Typography variant="body2">Add ingredients from your recipes to see them here.</Typography>
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default Groceries;
