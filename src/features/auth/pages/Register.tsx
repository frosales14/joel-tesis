import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import logoImg from '@/assets/san-logo.png';

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
                <Card className="shadow-large">
                    <CardHeader className="text-center space-y-6">
                        <div className="flex justify-center">
                            <img
                                src={logoImg}
                                alt="Sociedad Amigos de los Niños"
                                className="h-16 object-contain"
                            />
                        </div>
                        <div>
                            <CardTitle className="text-2xl text-muted-sage-green-700 mb-2">
                                Create Account ✨
                            </CardTitle>
                            <CardDescription className="text-gentle-slate-gray">
                                Join us today and get started
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-6">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
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

                            <div className="space-y-2">
                                <div className="flex items-start space-x-2">
                                    <Checkbox
                                        id="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onCheckedChange={(checked) =>
                                            setFormData(prev => ({ ...prev, agreeToTerms: !!checked }))
                                        }
                                        className="mt-1"
                                    />
                                    <Label htmlFor="agreeToTerms" className="text-sm leading-5">
                                        I agree to the{' '}
                                        <Button variant="link" type="button" className="p-0 h-auto text-accent hover:text-accent/80">
                                            Terms of Service
                                        </Button>{' '}
                                        and{' '}
                                        <Button variant="link" type="button" className="p-0 h-auto text-accent hover:text-accent/80">
                                            Privacy Policy
                                        </Button>
                                    </Label>
                                </div>
                                {validationErrors.agreeToTerms && (
                                    <p className="text-destructive text-xs mt-1">{validationErrors.agreeToTerms}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full"
                                size="lg"
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-muted-foreground">
                                Already have an account?{' '}
                                <Button variant="link" asChild className="p-0 h-auto text-soft-coral hover:text-soft-coral-600">
                                    <Link to="/">Sign in</Link>
                                </Button>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Register;
