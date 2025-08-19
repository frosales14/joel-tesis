import { Link } from 'react-router-dom';

function About() {
    return (
        <div>
            <h1>About Page</h1>
            <p>This is the about page of our React Router demo.</p>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Go to Home</Link>
                    </li>
                    <li>
                        <Link to="/contact">Go to Contact</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default About;
