import { useState, useEffect } from 'react'
import { authService } from '../services/authService'

// Types matching the updated auth service
interface User {
    id: string;
    email: string;
    name?: string;
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
        isLoading: true, // Start with loading true for Supabase
        error: null,
    })

    useEffect(() => {
        // Initialize auth state and set up real-time listener
        const initializeAuth = async () => {
            try {
                const user = await authService.getCurrentUser()
                setAuthState({
                    user,
                    isAuthenticated: !!user,
                    isLoading: false,
                    error: null,
                })
            } catch (error) {
                setAuthState({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: 'Failed to initialize authentication',
                })
            }
        }

        // Set up auth state listener for real-time updates
        const { data: { subscription } } = authService.onAuthStateChange((user) => {
            setAuthState(prev => ({
                ...prev,
                user,
                isAuthenticated: !!user,
                isLoading: false,
            }))
        })

        initializeAuth()

        // Cleanup subscription on unmount
        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    const login = async (credentials: LoginFormData) => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            const response = await authService.login(credentials)
            setAuthState({
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            })
        } catch (error) {
            setAuthState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Login failed',
            }))
            throw error
        }
    }

    const register = async (userData: RegisterFormData) => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            const response = await authService.register(userData)
            setAuthState({
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            })
        } catch (error) {
            setAuthState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Registration failed',
            }))
            throw error
        }
    }

    const logout = async () => {
        try {
            await authService.logout()
            setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            })
        } catch (error) {
            // Even if logout fails on server, clear local state
            setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            })
        }
    }

    const resetPassword = async (email: string) => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            await authService.resetPassword(email)
            setAuthState(prev => ({ ...prev, isLoading: false }))
        } catch (error) {
            setAuthState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Password reset failed',
            }))
            throw error
        }
    }

    const clearError = () => {
        setAuthState(prev => ({ ...prev, error: null }))
    }

    return {
        ...authState,
        login,
        register,
        logout,
        resetPassword,
        clearError,
    }
}