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
                            <CardTitle className="text-2xl text-soft-blue mb-2">
                                Welcome Back! 👋
                            </CardTitle>
                            <CardDescription className="text-gentle-slate-gray">
                                Sign in to your account to continue
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
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="demo@example.com"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="password"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="rememberMe"
                                        checked={formData.rememberMe}
                                        onCheckedChange={(checked) =>
                                            setFormData(prev => ({ ...prev, rememberMe: !!checked }))
                                        }
                                    />
                                    <Label htmlFor="rememberMe" className="text-sm">Remember me</Label>
                                </div>
                                <Button variant="link" type="button" className="text-sm p-0 h-auto">
                                    Forgot password?
                                </Button>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full"
                                size="lg"
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-muted-foreground">
                                Don't have an account?{' '}
                                <Button variant="link" asChild className="p-0 h-auto text-soft-coral hover:text-soft-coral-600">
                                    <Link to="/register">Sign up</Link>
                                </Button>
                            </p>
                        </div>

                        <div className="mt-6">
                            <Alert>
                                <AlertDescription className="text-center">
                                    <strong>Demo Credentials:</strong><br />
                                    Email: demo@example.com<br />
                                    Password: password
                                </AlertDescription>
                            </Alert>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Login;
