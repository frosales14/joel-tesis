import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import logoImg from '@/assets/san-logo.png';

function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-off-white via-soft-coral-50 to-warm-peach-100 flex items-center justify-center p-4 md:p-8">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-40 h-40 bg-soft-coral-200 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute bottom-20 right-20 w-32 h-32 bg-warm-peach-200 rounded-full opacity-25 blur-xl"></div>
                <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-pale-sky-yellow-200 rounded-full opacity-15 blur-xl"></div>
            </div>

            <div className="max-w-lg mx-auto text-center relative z-10">
                <Card className="shadow-large border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8 md:p-12">
                        {/* Logo */}
                        <div className="flex justify-center mb-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-soft-coral-100 rounded-2xl blur-lg opacity-40"></div>
                                <img
                                    src={logoImg}
                                    alt="Sociedad Amigos de los Niños"
                                    className="relative h-16 object-contain bg-white rounded-xl p-2 shadow-medium"
                                />
                            </div>
                        </div>

                        {/* 404 Illustration */}
                        <div className="text-8xl mb-6 animate-bounce">🔍</div>

                        <h1 className="text-6xl font-bold bg-gradient-to-r from-soft-coral to-soft-coral-600 bg-clip-text text-transparent mb-4">
                            404
                        </h1>

                        <h2 className="text-2xl font-semibold text-gentle-slate-gray mb-4">
                            Page Not Found
                        </h2>

                        <p className="text-gentle-slate-gray mb-8 text-lg leading-relaxed">
                            Oops! The page you're looking for seems to have wandered off.
                            Let's get you back on track! 🧭
                        </p>

                        <div className="space-y-4">
                            <Button
                                asChild
                                className="w-full h-12 bg-gradient-to-r from-soft-blue to-soft-blue-600 hover:from-soft-blue-600 hover:to-soft-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <Link to="/">
                                    🏠 Take Me to Login
                                </Link>
                            </Button>

                            <Button
                                onClick={() => window.history.back()}
                                variant="outline"
                                className="w-full h-12 border-muted-tan-300 text-gentle-slate-gray hover:bg-muted-tan-50 hover:border-muted-tan-400 transition-all duration-200"
                            >
                                ← Go Back
                            </Button>
                        </div>

                        <div className="mt-8 p-4 bg-warm-peach-50 rounded-lg border border-warm-peach-200">
                            <p className="text-sm text-muted-tan-700 mb-3 font-medium">Need help? Try these links:</p>
                            <div className="flex justify-center space-x-6">
                                <Button variant="link" asChild className="p-0 h-auto text-soft-blue hover:text-soft-blue-600">
                                    <Link to="/">Login</Link>
                                </Button>
                                <Button variant="link" asChild className="p-0 h-auto text-muted-sage-green hover:text-muted-sage-green-600">
                                    <Link to="/register">Register</Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default NotFound;
