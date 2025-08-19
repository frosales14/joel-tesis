import { Link } from 'react-router-dom';

function Contact() {
    return (
        <div>
            <h1>Contact Page</h1>
            <p>Get in touch with us!</p>
            <p>Email: example@example.com</p>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Go to Home</Link>
                    </li>
                    <li>
                        <Link to="/about">Go to About</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Contact;
