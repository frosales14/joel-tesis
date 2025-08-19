import { Link } from 'react-router-dom';

function About() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                        About Our Project 📖
                    </h1>

                    <div className="prose max-w-none">
                        <p className="text-lg text-gray-600 mb-6">
                            This is a demonstration project showcasing the power of modern web development
                            with React, TypeScript, React Router, and Tailwind CSS.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">⚛️ React + TypeScript</h3>
                                <p className="text-gray-600">
                                    Built with React 19 and TypeScript for type-safe, modern development.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">🚀 React Router v7</h3>
                                <p className="text-gray-600">
                                    Seamless client-side routing with the latest React Router.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">🎨 Tailwind CSS</h3>
                                <p className="text-gray-600">
                                    Beautiful, responsive design with utility-first CSS framework.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">⚡ Vite</h3>
                                <p className="text-gray-600">
                                    Lightning-fast development with Vite build tool.
                                </p>
                            </div>
                        </div>
                    </div>

                    <nav className="flex justify-center space-x-4">
                        <Link
                            to="/"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                        >
                            ← Back to Home
                        </Link>
                        <Link
                            to="/contact"
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
                        >
                            Contact Us →
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default About;
