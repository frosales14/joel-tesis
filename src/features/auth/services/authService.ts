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

interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

// Mock API endpoints - replace with actual API calls
const API_BASE_URL = 'https://api.example.com';

class AuthService {
    private getAuthToken(): string | null {
        return localStorage.getItem('authToken');
    }

    private setAuthToken(token: string): void {
        localStorage.setItem('authToken', token);
    }

    private removeAuthToken(): void {
        localStorage.removeItem('authToken');
    }

    async login(credentials: LoginFormData): Promise<AuthResponse> {
        try {
            // Mock API call - replace with actual implementation
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data: AuthResponse = await response.json();
            this.setAuthToken(data.accessToken);

            return data;
        } catch (error) {
            // Mock implementation for demo
            if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
                const mockResponse: AuthResponse = {
                    user: {
                        id: '1',
                        email: credentials.email,
                        name: 'Demo User',
                        avatar: 'https://via.placeholder.com/100',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    accessToken: 'mock-access-token',
                    refreshToken: 'mock-refresh-token',
                };
                this.setAuthToken(mockResponse.accessToken);
                return mockResponse;
            }
            throw new Error('Invalid credentials. Try demo@example.com / password');
        }
    }

    async register(userData: RegisterFormData): Promise<AuthResponse> {
        try {
            // Mock API call - replace with actual implementation
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data: AuthResponse = await response.json();
            this.setAuthToken(data.accessToken);

            return data;
        } catch (error) {
            // Mock implementation for demo
            const mockResponse: AuthResponse = {
                user: {
                    id: '2',
                    email: userData.email,
                    name: userData.name,
                    avatar: 'https://via.placeholder.com/100',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
            };
            this.setAuthToken(mockResponse.accessToken);
            return mockResponse;
        }
    }

    async logout(): Promise<void> {
        try {
            const token = this.getAuthToken();
            if (token) {
                // Mock API call - replace with actual implementation
                await fetch(`${API_BASE_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            }
        } catch (error) {
            console.warn('Logout API call failed:', error);
        } finally {
            this.removeAuthToken();
        }
    }

    async getCurrentUser(): Promise<User | null> {
        const token = this.getAuthToken();
        if (!token) return null;

        try {
            // Mock API call - replace with actual implementation
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                this.removeAuthToken();
                return null;
            }

            return await response.json();
        } catch (error) {
            // Mock implementation for demo
            if (token === 'mock-access-token') {
                return {
                    id: '1',
                    email: 'demo@example.com',
                    name: 'Demo User',
                    avatar: 'https://via.placeholder.com/100',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
            }
            this.removeAuthToken();
            return null;
        }
    }

    async refreshToken(): Promise<string | null> {
        const token = this.getAuthToken();
        if (!token) return null;

        try {
            // Mock API call - replace with actual implementation
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                this.removeAuthToken();
                return null;
            }

            const data = await response.json();
            this.setAuthToken(data.accessToken);
            return data.accessToken;
        } catch (error) {
            this.removeAuthToken();
            return null;
        }
    }
}

export const authService = new AuthService();
