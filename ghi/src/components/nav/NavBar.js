
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import './NavBar.css'
import { useDispatch } from 'react-redux';
import { setToken } from "../../store/tokenSlice";

function Navbar() {
    const token = useSelector(state => state.token)
    const dispatch = useDispatch()


    const handleLogout = async () => {
        localStorage.removeItem('token');
        dispatch(setToken(null));
    };


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
                            <Link onClick={handleLogout} to='/login'>Logout</Link>
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