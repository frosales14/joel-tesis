import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import logoImg from '@/assets/san-logo.png';

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
            navigate('/dashboard/alumnos'); // Redirect to home after successful login
        } catch (error) {
            // Error is handled by the useAuth hook
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-off-white via-warm-peach-50 to-pale-sky-yellow-100 flex items-center justify-center p-4 md:p-8">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-32 h-32 bg-soft-blue-200 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-warm-peach-200 rounded-full opacity-30 blur-xl"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-muted-sage-green-200 rounded-full opacity-25 blur-xl"></div>
            </div>

            <div className="max-w-md w-full relative z-10">
                <Card className="shadow-large border-0 bg-white backdrop-blur-sm">
                    <CardHeader className="text-center space-y-6 pb-6">
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-soft-blue-100 rounded-2xl blur-lg opacity-50"></div>
                                <img
                                    src={logoImg}
                                    alt="Sociedad Amigos de los Niños"
                                    className="relative h-20 object-contain bg-chart-1/80 rounded-xl p-3 shadow-medium"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <CardDescription className=" text-base">
                                Inicia sesión en tu cuenta para hacer la diferencia
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {error && (
                            <Alert variant="destructive" className="mb-6 border-soft-coral bg-soft-coral-50">
                                <AlertDescription className="text-soft-coral-700">{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <Label htmlFor="email" className="text-gentle-slate-gray font-medium">Correo Electronico</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="demo@example.com"
                                    required
                                    className="h-12 bg-neutral-off-white border-muted-tan-300 focus:border-soft-blue focus:ring-soft-blue/20 transition-all duration-200"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="password" className="text-gentle-slate-gray font-medium">Contraseña</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="password"
                                    required
                                    className="h-12 bg-neutral-off-white border-muted-tan-300 focus:border-soft-blue focus:ring-soft-blue/20 transition-all duration-200"
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="default"
                                disabled={isLoading}
                                size="lg"
                                className="w-full "
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                        <span>Iniciando sesión...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span>Iniciar Sesión</span>
                                    </>
                                )}
                            </Button>
                        </form>




                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Login;
