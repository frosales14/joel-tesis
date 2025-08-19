import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Types defined inline
interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
}

function Register() {
    const navigate = useNavigate();
    const { register, isLoading, error } = useAuth();
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // Clear validation error for this field
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (formData.name.length < 2) {
            errors.name = 'Name must be at least 2 characters long';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters long';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.agreeToTerms) {
            errors.agreeToTerms = 'You must agree to the terms and conditions';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await register(formData);
            navigate('/'); // Redirect to home after successful registration
        } catch (error) {
            // Error is handled by the useAuth hook
            console.error('Registration failed:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-off-white to-muted-sage-green-100 flex items-center justify-center p-8">
            <div className="max-w-md w-full">
                <div className="bg-neutral-off-white rounded-2xl shadow-large border border-muted-sage-green-200 p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-muted-sage-green-700 mb-2">
                            Create Account ✨
                        </h1>
                        <p className="text-gentle-slate-gray">
                            Join us today and get started
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
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-muted-sage-green focus:border-muted-sage-green bg-white transition-colors ${validationErrors.name ? 'border-soft-coral-300' : 'border-muted-tan-300'
                                    }`}
                                placeholder="John Doe"
                            />
                            {validationErrors.name && (
                                <p className="text-soft-coral-600 text-xs mt-1">{validationErrors.name}</p>
                            )}
                        </div>

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
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-muted-sage-green focus:border-muted-sage-green bg-white transition-colors ${validationErrors.email ? 'border-soft-coral-300' : 'border-muted-tan-300'
                                    }`}
                                placeholder="john@example.com"
                            />
                            {validationErrors.email && (
                                <p className="text-soft-coral-600 text-xs mt-1">{validationErrors.email}</p>
                            )}
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
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-muted-sage-green focus:border-muted-sage-green bg-white transition-colors ${validationErrors.password ? 'border-soft-coral-300' : 'border-muted-tan-300'
                                    }`}
                                placeholder="••••••••"
                            />
                            {validationErrors.password && (
                                <p className="text-soft-coral-600 text-xs mt-1">{validationErrors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gentle-slate-gray mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-muted-sage-green focus:border-muted-sage-green bg-white transition-colors ${validationErrors.confirmPassword ? 'border-soft-coral-300' : 'border-muted-tan-300'
                                    }`}
                                placeholder="••••••••"
                            />
                            {validationErrors.confirmPassword && (
                                <p className="text-soft-coral-600 text-xs mt-1">{validationErrors.confirmPassword}</p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-start">
                                <input
                                    type="checkbox"
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-muted-sage-green border-muted-tan-300 rounded focus:ring-muted-sage-green mt-1"
                                />
                                <span className="ml-2 text-sm text-gentle-slate-gray">
                                    I agree to the{' '}
                                    <button type="button" className="text-muted-sage-green-600 hover:text-muted-sage-green-700 hover:underline">
                                        Terms of Service
                                    </button>{' '}
                                    and{' '}
                                    <button type="button" className="text-muted-sage-green-600 hover:text-muted-sage-green-700 hover:underline">
                                        Privacy Policy
                                    </button>
                                </span>
                            </label>
                            {validationErrors.agreeToTerms && (
                                <p className="text-soft-coral-600 text-xs mt-1">{validationErrors.agreeToTerms}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-muted-sage-green text-white py-3 rounded-lg hover:bg-muted-sage-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-semibold shadow-soft"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gentle-slate-gray">
                            Already have an account?{' '}
                            <Link to="/" className="text-soft-coral hover:text-soft-coral-600 hover:underline font-semibold">
                                Sign in
                            </Link>
                        </p>
                    </div>


                </div>
            </div>
        </div>
    );
}

export default Register;
