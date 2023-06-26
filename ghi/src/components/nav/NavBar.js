import LogOutButton from "../logOutButton/LogOutButton";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import './NavBar.css'

function Navbar() {
    const token = useSelector(state => state.token)

    return (
        <nav>
            <ul>
                {token ? (
                    <>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/leaderboards">Leaderboards</Link>
                        </li>
                        <li>
                            <LogOutButton />
                        </li>
                    </>
                ) : (
                    <li>
                        <Link to='/login'>Log in</Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}

export default Navbar;