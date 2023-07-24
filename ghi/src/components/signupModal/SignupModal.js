import Modal from "react-modal";
import { useCreateUserMutation, useGetTokenMutation } from "../../store/Api";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/tokenSlice';
import { useNavigate } from 'react-router-dom';
import './SignupModal.css'


// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

function SignupModal({ setModalIsOpen, modalIsOpen }) {

    let initialData = {
        username: "",
        password: "",
        email: "",
        firstName: "",
        lastName: "",
    };

    const [formData, setFormData] = useState(initialData);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [createUser] = useCreateUserMutation();


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = formData
        data['first_name'] = formData.firstName
        data['last_name'] = formData.lastName
        const response = await createUser(data);
        if (response.error) {
            console.log(response.error);
        } else {
            dispatch(setToken(response.data.access));
            navigate('/');
        }
    };

    return (
        <>
            <div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    id="signup-modal"
                    className="signup-modal-content"
                    overlayClassName="signup-modal-overlay"
                >
                    <>
                        <div className="" id="signup-form">
                            <form onSubmit={handleSubmit}>
                                <h1 className="">Sign Up</h1>
                                <div className="mb-3">
                                    <input
                                        autoFocus
                                        onChange={handleChange}
                                        value={formData.email}
                                        placeholder="Email"
                                        required
                                        type="text"
                                        name="email"
                                        className=""
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        autoFocus
                                        onChange={handleChange}
                                        value={formData.username}
                                        placeholder="Username"
                                        required
                                        type="text"
                                        name="username"
                                        className=""
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        autoFocus
                                        onChange={handleChange}
                                        value={formData.firstName}
                                        placeholder="First Name"
                                        required
                                        type="text"
                                        name="firstName"
                                        className=""
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        autoFocus
                                        onChange={handleChange}
                                        value={formData.lastName}
                                        placeholder="Last Name"
                                        required
                                        type="text"
                                        name="lastName"
                                        className=""
                                    />
                                </div>
                                <div className="">
                                    <input
                                        onChange={handleChange}
                                        value={formData.password}
                                        placeholder="Password"
                                        required
                                        type="password"
                                        name="password"
                                        autoComplete="on"
                                        className=""
                                    />
                                </div>
                                <div className="">
                                    <button className="" id="login-button">Sign Up</button>
                                </div>
                            </form>
                        </div>
                    </>
                </Modal>
            </div>
        </>
    );
}

export default SignupModal;
