import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
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
        <div className="min-h-screen bg-gradient-to-br from-neutral-off-white via-muted-sage-green-50 to-warm-peach-100 flex items-center justify-center p-4 md:p-8">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-36 h-36 bg-muted-sage-green-200 rounded-full opacity-25 blur-xl"></div>
                <div className="absolute bottom-20 left-20 w-32 h-32 bg-warm-peach-200 rounded-full opacity-30 blur-xl"></div>
                <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-pale-sky-yellow-200 rounded-full opacity-20 blur-xl"></div>
            </div>

            <div className="max-w-md w-full relative z-10">
                <Card className="shadow-large border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center space-y-6 pb-6">
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-muted-sage-green-100 rounded-2xl blur-lg opacity-50"></div>
                                <img
                                    src={logoImg}
                                    alt="Sociedad Amigos de los Niños"
                                    className="relative h-20 object-contain bg-chart-1/80 rounded-xl p-3 shadow-medium"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">

                            <CardDescription className="text-gentle-slate-gray text-base">
                                Comienza a hacer una diferencia
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
                                <label className="block text-left text-sm font-medium text-gentle-slate-gray mb-2">
                                    Nombre Completo
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
                                <label className="block  text-left text-sm font-medium text-gentle-slate-gray mb-2">
                                    Correo Electrónico
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
                                <label className="block text-left text-sm font-medium text-gentle-slate-gray mb-2">
                                    Contraseña
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
                                <label className="block text-left text-sm font-medium text-gentle-slate-gray mb-2">
                                    Confirmar Contraseña
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



                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full "
                                size="lg"
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                        <span>Creando Cuenta...</span>
                                    </div>
                                ) : (
                                    'Crear Cuenta'
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gentle-slate-gray">
                                Ya tienes una cuenta?{' '}
                                <Button variant="link" asChild className="p-0 h-auto text-soft-coral hover:text-soft-coral-600 font-semibold">
                                    <Link to="/">Inicia sesión aquí</Link>
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
