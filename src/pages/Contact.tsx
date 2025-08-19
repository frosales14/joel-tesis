import { Link } from 'react-router-dom';

function Contact() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                        Contact Us 📞
                    </h1>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        {/* Contact Info */}
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Get in Touch</h2>

                            <div className="space-y-4">
                                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl mr-4">📧</div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Email</h3>
                                        <p className="text-gray-600">example@example.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl mr-4">📱</div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Phone</h3>
                                        <p className="text-gray-600">+1 (555) 123-4567</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl mr-4">📍</div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Location</h3>
                                        <p className="text-gray-600">Remote & Worldwide</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send a Message</h2>

                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Your message..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-semibold"
                                >
                                    Send Message 🚀
                                </button>
                            </form>
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
                            to="/about"
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
                        >
                            About Us →
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default Contact;
