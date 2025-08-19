// Application routes constants
export const ROUTES = {
    LOGIN: '/',
    REGISTER: '/register',
    // Legacy routes for compatibility
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
    },
} as const;

// Route labels for navigation
export const ROUTE_LABELS = {
    [ROUTES.LOGIN]: 'Sign In',
    [ROUTES.REGISTER]: 'Sign Up',
    [ROUTES.AUTH.LOGIN]: 'Sign In',
    [ROUTES.AUTH.REGISTER]: 'Sign Up',
} as const;
