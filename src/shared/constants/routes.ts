// Application routes constants
export const ROUTES = {
    HOME: '/',
    ABOUT: '/about',
    CONTACT: '/contact',
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
    },
} as const;

// Route labels for navigation
export const ROUTE_LABELS = {
    [ROUTES.HOME]: 'Home',
    [ROUTES.ABOUT]: 'About',
    [ROUTES.CONTACT]: 'Contact',
    [ROUTES.AUTH.LOGIN]: 'Sign In',
    [ROUTES.AUTH.REGISTER]: 'Sign Up',
} as const;
