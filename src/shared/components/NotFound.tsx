import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-off-white to-soft-coral-100 p-8 flex items-center justify-center">
            <div className="max-w-md mx-auto text-center">
                <div className="bg-neutral-off-white rounded-2xl shadow-large border border-soft-coral-200 p-8">
                    {/* 404 Illustration */}
                    <div className="text-8xl mb-6">🚫</div>

                    <h1 className="text-6xl font-bold text-soft-coral mb-4">
                        404
                    </h1>

                    <h2 className="text-2xl font-semibold text-gentle-slate-gray mb-4">
                        Page Not Found
                    </h2>

                    <p className="text-gentle-slate-gray mb-8">
                        Oops! The page you're looking for seems to have wandered off into the digital void.
                        Don't worry, it happens to the best of us!
                    </p>

                    <div className="space-y-4">
                        <Link
                            to="/"
                            className="block bg-soft-blue text-white px-8 py-3 rounded-lg hover:bg-soft-blue-600 transition-colors duration-200 font-semibold shadow-soft"
                        >
                            🏠 Take Me to Login
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="block w-full bg-muted-tan text-white px-8 py-3 rounded-lg hover:bg-muted-tan-600 transition-colors duration-200 font-semibold"
                        >
                            ← Go Back
                        </button>
                    </div>

                    <div className="mt-8 text-sm text-gentle-slate-gray-600">
                        <p>Need help? Try these links:</p>
                        <div className="flex justify-center space-x-4 mt-2">
                            <Link to="/" className="text-soft-blue hover:text-soft-blue-600 hover:underline">Login</Link>
                            <Link to="/register" className="text-muted-sage-green hover:text-muted-sage-green-600 hover:underline">Register</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
