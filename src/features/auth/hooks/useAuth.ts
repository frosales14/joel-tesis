import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

// Types defined inline to avoid circular dependencies
interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface LoginFormData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
    });

    useEffect(() => {
        // Check if user is already logged in on app start
        const initializeAuth = async () => {
            try {
                const user = await authService.getCurrentUser();
                if (user) {
                    setAuthState({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } else {
                    setAuthState(prev => ({ ...prev, isLoading: false }));
                }
            } catch (error) {
                setAuthState({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: 'Failed to initialize authentication',
                });
            }
        };

        initializeAuth();
    }, []);

    const login = async (credentials: LoginFormData) => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await authService.login(credentials);
            setAuthState({
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            setAuthState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Login failed',
            }));
            throw error;
        }
    };

    const register = async (userData: RegisterFormData) => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await authService.register(userData);
            setAuthState({
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            setAuthState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Registration failed',
            }));
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            // Even if logout fails on server, clear local state
            setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        }
    };

    const clearError = () => {
        setAuthState(prev => ({ ...prev, error: null }));
    };

    return {
        ...authState,
        login,
        register,
        logout,
        clearError,
    };
};
