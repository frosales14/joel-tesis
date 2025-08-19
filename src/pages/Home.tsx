import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1>Home Page</h1>
            <p>Welcome to the React Router demo!</p>
            <nav>
                <ul>
                    <li>
                        <Link to="/about">Go to About</Link>
                    </li>
                    <li>
                        <Link to="/contact">Go to Contact</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Home;
