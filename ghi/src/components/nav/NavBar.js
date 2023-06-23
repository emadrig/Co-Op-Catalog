import React from "react";
import { Link } from "react-router-dom";
import './NavBar.css'
import { useGetTokenQuery } from '../../store/Api';


function Navbar() {
    const { data: token } = useGetTokenQuery();
    return (
        <nav>
            {token &&
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/leaderboards">Leaderboards</Link>
                    </li>
                </ul>
            }
                <ul>
                    <li>
                        <Link to='/login'>Log in</Link>
                    </li>
                </ul>
        </nav>
    )
}

export default Navbar