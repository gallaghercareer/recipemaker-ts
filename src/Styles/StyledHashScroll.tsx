import { HashLink, type HashLinkProps } from 'react-router-hash-link';
import { styled } from '@mui/system';

/*
Notes:
The StyledHashButton is being used for smoothscrolling on the page. MUI can use it, but because it is a helper tag outside of MUI it looks different by default
*/

export const StyledHashButton = styled(HashLink)<HashLinkProps>({
    color: 'white',
    '&:visited': {
        color: 'white'
    },
    padding: '5px 15px', // Shorthand for top/bottom left/right
    textDecoration: "none",
    fontSize: 25,
    fontWeight: 500,
    transition: 'opacity 0.2s',
    '&:hover': {
        opacity: 0.8
    }
});

export const StyledLink = styled(HashLink)<HashLinkProps>({
    textDecoration: "none",
    color: 'inherit'
});