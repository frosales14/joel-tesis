import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold text-center text-gray-800 mb-8">
                    Welcome Home! 🏠
                </h1>
                <p className="text-xl text-gray-600 text-center mb-12">
                    Welcome to our React Router + Tailwind CSS demo!
                </p>

                <nav className="flex justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Link
                            to="/about"
                            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 text-center group"
                        >
                            <div className="text-3xl mb-4">ℹ️</div>
                            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">
                                About Us
                            </h3>
                            <p className="text-gray-600 mt-2">Learn more about our project</p>
                        </Link>

                        <Link
                            to="/contact"
                            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 text-center group"
                        >
                            <div className="text-3xl mb-4">📞</div>
                            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">
                                Contact
                            </h3>
                            <p className="text-gray-600 mt-2">Get in touch with us</p>
                        </Link>

                        <Link
                            to="/auth/login"
                            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 text-center group"
                        >
                            <div className="text-3xl mb-4">🔐</div>
                            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">
                                Sign In
                            </h3>
                            <p className="text-gray-600 mt-2">Access your account</p>
                        </Link>

                        <Link
                            to="/auth/register"
                            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 text-center group"
                        >
                            <div className="text-3xl mb-4">✨</div>
                            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">
                                Sign Up
                            </h3>
                            <p className="text-gray-600 mt-2">Create new account</p>
                        </Link>
                    </div>
                </nav>
            </div>
        </div>
    );
}

export default Home;
