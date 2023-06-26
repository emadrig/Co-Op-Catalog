import { useLogOutMutation } from "../../store/Api";
import { useNavigate } from "react-router-dom";

function LogOutButton() {
    const [logout, { isLoading }] = useLogOutMutation();
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout();
        localStorage.removeItem('token');
        navigate('/login')
    };

    return (
        <button onClick={handleLogout} disabled={isLoading}>
            Logout
        </button>
    );
}

export default LogOutButton
