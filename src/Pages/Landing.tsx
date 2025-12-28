import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ShareIcon from '@mui/icons-material/Share';
import StorageIcon from '@mui/icons-material/Storage';

const Landing = () => {
    return (
        <Box>
            {/* Hero Section */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 10, textAlign: 'center' }}>
                <Container maxWidth="md">
                    <Typography variant="h2" fontWeight="800" gutterBottom>
                        Master Your Kitchen
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                        The digital recipe box designed for modern cooks.
                        Store, organize, and share your culinary creations.
                    </Typography>
                    <Typography variant="subtitle1">
                        Please use the <strong>Login</strong> button in the navigation bar to get started.
                    </Typography>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 8 }} id="features">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                            <RestaurantMenuIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                            <Typography variant="h6" gutterBottom>Create Recipes</Typography>
                            <Typography color="text.secondary">
                                Use our intuitive editor to draft your recipes with ingredients and step-by-step instructions.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                            <StorageIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                            <Typography variant="h6" gutterBottom>Cloud Storage</Typography>
                            <Typography color="text.secondary">
                                Access your recipes from any device, anywhere. Your data is securely backed up in the cloud.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                            <ShareIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                            <Typography variant="h6" gutterBottom>Social Sharing</Typography>
                            <Typography color="text.secondary">
                                Coming soon! Share your best dishes with friends and family with a single click.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Landing;