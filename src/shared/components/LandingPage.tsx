import { Link } from 'react-router-dom';

function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-8">
            <div className="max-w-4xl mx-auto text-center">
                <div className="bg-white rounded-xl shadow-lg p-12">
                    <div className="text-6xl mb-8">🚀</div>

                    <h1 className="text-5xl font-bold text-gray-800 mb-6">
                        Welcome to Your App
                    </h1>

                    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                        A modern React application built with TypeScript, React Router v7,
                        Tailwind CSS, and a clean feature-based architecture.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        <Link
                            to="/auth/login"
                            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold text-lg shadow-lg"
                        >
                            🔐 Sign In
                        </Link>

                        <Link
                            to="/auth/register"
                            className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold text-lg shadow-lg"
                        >
                            ✨ Create Account
                        </Link>
                    </div>

                    <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            🏗️ Built With Modern Stack
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                                <div className="font-medium">⚛️ React 19</div>
                                <div>+ TypeScript</div>
                            </div>
                            <div>
                                <div className="font-medium">🚀 React Router v7</div>
                                <div>Client-side routing</div>
                            </div>
                            <div>
                                <div className="font-medium">🎨 Tailwind CSS</div>
                                <div>Utility-first styling</div>
                            </div>
                            <div>
                                <div className="font-medium">⚡ Vite</div>
                                <div>Fast development</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-sm text-gray-500">
                        <p>
                            Demo credentials: <strong>demo@example.com</strong> / <strong>password</strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
