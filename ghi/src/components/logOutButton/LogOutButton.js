import { useLogOutMutation } from "../../store/Api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setToken } from "../../store/tokenSlice";

function LogOutButton() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async () => {
        localStorage.removeItem('token');
        dispatch(setToken(null));
        navigate('/login')
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
}

export default LogOutButton
