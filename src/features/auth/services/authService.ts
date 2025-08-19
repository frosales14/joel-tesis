import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

// Updated types to match Supabase
interface CustomUser {
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

interface AuthResponse {
    user: CustomUser;
    session: Session;
}

class AuthService {
    // Convert Supabase User to our CustomUser format
    private mapSupabaseUser(user: User, userMetadata?: any): CustomUser {
        return {
            id: user.id,
            email: user.email!,
            name: userMetadata?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            avatar: user.user_metadata?.avatar_url,
            createdAt: new Date(user.created_at || ''),
            updatedAt: new Date(user.updated_at || '')
        }
    }

    async login(credentials: LoginFormData): Promise<AuthResponse> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
        })

        if (error) {
            throw new Error(error.message)
        }

        if (!data.user || !data.session) {
            throw new Error('Login failed - no user data returned')
        }

        return {
            user: this.mapSupabaseUser(data.user),
            session: data.session
        }
    }

    async register(userData: RegisterFormData): Promise<AuthResponse> {
        if (userData.password !== userData.confirmPassword) {
            throw new Error('Passwords do not match')
        }

        if (!userData.agreeToTerms) {
            throw new Error('You must agree to the terms and conditions')
        }

        const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
                data: {
                    name: userData.name,
                }
            }
        })

        if (error) {
            throw new Error(error.message)
        }

        if (!data.user) {
            throw new Error('Registration failed - no user data returned')
        }

        // Check if email confirmation is required
        if (!data.session) {
            throw new Error('Please check your email to confirm your account before signing in')
        }

        return {
            user: this.mapSupabaseUser(data.user),
            session: data.session
        }
    }

    async logout(): Promise<void> {
        const { error } = await supabase.auth.signOut()
        if (error) {
            throw new Error(error.message)
        }
    }

    async getCurrentUser(): Promise<CustomUser | null> {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return null
        }

        return this.mapSupabaseUser(user)
    }

    async getCurrentSession(): Promise<Session | null> {
        const { data: { session } } = await supabase.auth.getSession()
        return session
    }

    // Get auth state changes for real-time updates
    onAuthStateChange(callback: (user: CustomUser | null) => void) {
        return supabase.auth.onAuthStateChange((event, session) => {
            const user = session?.user ? this.mapSupabaseUser(session.user) : null
            callback(user)
        })
    }

    // Password reset functionality
    async resetPassword(email: string): Promise<void> {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        })

        if (error) {
            throw new Error(error.message)
        }
    }

    // Update user profile
    async updateProfile(updates: { name?: string; avatar?: string }): Promise<CustomUser> {
        const { data, error } = await supabase.auth.updateUser({
            data: updates
        })

        if (error) {
            throw new Error(error.message)
        }

        if (!data.user) {
            throw new Error('Failed to update profile')
        }

        return this.mapSupabaseUser(data.user)
    }
}

export const authService = new AuthService()