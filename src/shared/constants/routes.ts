// Application routes constants
export const ROUTES = {
    HOME: '/',
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
    },
} as const;

// Route labels for navigation
export const ROUTE_LABELS = {
    [ROUTES.HOME]: 'Home',
    [ROUTES.AUTH.LOGIN]: 'Sign In',
    [ROUTES.AUTH.REGISTER]: 'Sign Up',
} as const;
