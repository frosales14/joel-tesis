import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-8 flex items-center justify-center">
            <div className="max-w-md mx-auto text-center">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    {/* 404 Illustration */}
                    <div className="text-8xl mb-6">🚫</div>

                    <h1 className="text-6xl font-bold text-gray-800 mb-4">
                        404
                    </h1>

                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        Page Not Found
                    </h2>

                    <p className="text-gray-600 mb-8">
                        Oops! The page you're looking for seems to have wandered off into the digital void.
                        Don't worry, it happens to the best of us!
                    </p>

                    <div className="space-y-4">
                        <Link
                            to="/"
                            className="block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                        >
                            🏠 Take Me Home
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="block w-full bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-semibold"
                        >
                            ← Go Back
                        </button>
                    </div>

                    <div className="mt-8 text-sm text-gray-500">
                        <p>Lost? Here are some helpful links:</p>
                        <div className="flex justify-center space-x-4 mt-2">
                            <Link to="/about" className="text-blue-600 hover:underline">About</Link>
                            <Link to="/contact" className="text-blue-600 hover:underline">Contact</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
