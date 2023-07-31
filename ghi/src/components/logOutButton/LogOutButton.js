import { useLogOutMutation } from "../../store/Api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setToken } from "../../store/tokenSlice";
import './LogOutButton.css'

function LogOutButton() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async () => {
        localStorage.removeItem('token');
        dispatch(setToken(null));
        navigate('/login')
    };

    return (
        <div onClick={handleLogout} id="log-out-button">
            Logout
        </div>
    );
}

export default LogOutButton
