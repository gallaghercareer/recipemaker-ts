import { Box, Container, Typography, Grid, Paper, Button, useTheme } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useMsal, UnauthenticatedTemplate, AuthenticatedTemplate } from '@azure/msal-react';
import { loginRequest } from '../Config/Auth';

const Landing = () => {
    const theme = useTheme();
    const { instance } = useMsal();

    const handleLoginRedirect = async () => {
        const customRequest = {
            ...loginRequest,
            redirectUri: import.meta.env.VITE_REDIRECT_URI
        };
        instance.loginRedirect(customRequest).catch((error) => console.log(error));
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    pt: { xs: 10, md: 20 },
                    pb: { xs: 10, md: 15 },
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative circle */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -100,
                        left: -100,
                        width: 300,
                        height: 300,
                        borderRadius: '50%',
                        bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                        zIndex: 0,
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -50,
                        right: -50,
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                        zIndex: 0,
                    }}
                />

                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography
                        variant="h2"
                        fontWeight="800"
                        gutterBottom
                        sx={{ 
                            fontSize: { xs: '2.5rem', md: '3.75rem' },
                            color: 'secondary.main' // Terracotta accent
                        }}
                    >
                        Master Your Kitchen
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            mb: 6,
                            opacity: 0.9,
                            fontWeight: 300,
                            maxWidth: '600px',
                            mx: 'auto',
                            lineHeight: 1.6,
                             color: 'text.secondary'
                        }}
                    >
                        The digital recipe box designed for modern cooks.
                        Store, organize, and share your culinary creations with ease.
                    </Typography>

                    <UnauthenticatedTemplate>
                        <Button
                            variant="contained"
                            size="large"
                            color="secondary"
                            onClick={handleLoginRedirect}
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                                py: 1.5,
                                px: 4,
                                fontSize: '1.2rem',
                                borderRadius: '50px',
                                textTransform: 'none',
                                boxShadow: 3,
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 6,
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Get Started
                        </Button>
                    </UnauthenticatedTemplate>

                    <AuthenticatedTemplate>
                         <Button
                            variant="contained"
                            size="large"
                            color="secondary"
                             href="/view-recipes" // Assuming this route exists based on structure
                            endIcon={<RestaurantMenuIcon />}
                            sx={{
                                py: 1.5,
                                px: 4,
                                fontSize: '1.2rem',
                                borderRadius: '50px',
                                textTransform: 'none',
                                boxShadow: 3,
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 6,
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Go to Recipes
                        </Button>
                    </AuthenticatedTemplate>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 10 }} id="features">
                <Grid container spacing={4}>
                    {[
                        {
                            image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80",
                            title: "Create Recipes",
                            desc: "Use our intuitive editor to draft your recipes with ingredients and step-by-step instructions."
                        },
                        {
                            image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
                            title: "Cloud Storage",
                            desc: "Access your recipes from any device, anywhere. Your data is securely backed up in the cloud."
                        },
                        {
                            image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=600&q=80",
                            title: "Social Sharing",
                            desc: "Coming soon! Share your best dishes with friends and family with a single click."
                        }
                    ].map((feature, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 0, // Remove padding to let image bleed to edge if desired, or keep generic container
                                    overflow: 'hidden',
                                    textAlign: 'center',
                                    height: '100%',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 4,
                                    bgcolor: 'background.paper',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: 3,
                                        borderColor: 'transparent'
                                    }
                                }}
                            >
                                <Box 
                                    component="img"
                                    src={feature.image}
                                    alt={feature.title}
                                    sx={{ 
                                        width: '100%', 
                                        height: 200, 
                                        objectFit: 'cover',
                                        mb: 3
                                    }} 
                                />
                                <Box sx={{ px: 3, pb: 4 }}>
                                    <Typography variant="h5" gutterBottom fontWeight="600" color="secondary.main">
                                        {feature.title}
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                        {feature.desc}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Footer / Bottom CTA */}
            <Box sx={{ bgcolor: 'background.paper', py: 6, mt: 'auto', borderTop: '1px solid', borderColor: 'divider' }}>
                <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                     <Typography variant="body1" color="text.secondary">
                        © {new Date().getFullYear()} RecipeMaker. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default Landing;