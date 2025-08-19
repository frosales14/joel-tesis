import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Types defined inline
interface LoginFormData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

function Login() {
    const navigate = useNavigate();
    const { login, isLoading, error } = useAuth();
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
        rememberMe: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(formData);
            navigate('/'); // Redirect to home after successful login
        } catch (error) {
            // Error is handled by the useAuth hook
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-off-white to-warm-peach-100 flex items-center justify-center p-8">
            <div className="max-w-md w-full">
                <div className="bg-neutral-off-white rounded-2xl shadow-large border border-warm-peach-200 p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-soft-blue mb-2">
                            Welcome Back! 👋
                        </h1>
                        <p className="text-gentle-slate-gray">
                            Sign in to your account to continue
                        </p>
                    </div>

                    {error && (
                        <div className="bg-soft-coral-50 border border-soft-coral-200 rounded-lg p-4 mb-6">
                            <p className="text-soft-coral-700 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gentle-slate-gray mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-muted-tan-300 rounded-lg focus:ring-2 focus:ring-soft-blue focus:border-soft-blue bg-white transition-colors"
                                placeholder="demo@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gentle-slate-gray mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-muted-tan-300 rounded-lg focus:ring-2 focus:ring-soft-blue focus:border-soft-blue bg-white transition-colors"
                                placeholder="password"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-soft-blue border-muted-tan-300 rounded focus:ring-soft-blue"
                                />
                                <span className="ml-2 text-sm text-gentle-slate-gray">Remember me</span>
                            </label>
                            <button type="button" className="text-sm text-soft-blue hover:text-soft-blue-600 hover:underline">
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-soft-blue text-white py-3 rounded-lg hover:bg-soft-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-semibold shadow-soft"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gentle-slate-gray">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-soft-coral hover:text-soft-coral-600 hover:underline font-semibold">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    <div className="mt-6 text-center">
                        <div className="text-xs text-gentle-slate-gray-600 bg-warm-peach-50 border border-warm-peach-200 p-3 rounded-lg">
                            <p className="font-semibold mb-1 text-muted-tan-700">Demo Credentials:</p>
                            <p>Email: demo@example.com</p>
                            <p>Password: password</p>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}

export default Login;
