import { useGetTokenMutation } from "../../store/Api";
import { useState, useCallback } from "react";
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/tokenSlice';
import { useNavigate } from 'react-router-dom';
import SignupModal from "../signupModal/SignupModal";
import './LoginForm.css'


let initialData = {
  username: "",
  password: "",
};

const LoginForm = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();
  const [getToken] = useGetTokenMutation();
  const dispatch = useDispatch()
  const [formData, setFormData] = useState(initialData);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await getToken(formData);
    if (response.error) {
      alert("Incorrect Password or Username");
    } else {
      dispatch(setToken(response.data.access));
      navigate('/');
    }
  };

  const activateSignupModal = () => {
      setModalIsOpen(true)
  }

  return (
    <>
      <div className="" id="login-form">
        <form onSubmit={handleSubmit} >
          <h1 className="">User Login</h1>
          <div className="mb-3">
            <input
              autoFocus
              onChange={handleChange}
              value={formData.name}
              placeholder="Username"
              required
              type="text"
              name="username"
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
            <button
              className=""
              id="login-button"
            >
              Login
            </button>
          </div>
        </form>
        <div>
          <button onClick={activateSignupModal} className="">
            Don't have an account?
          </button>
        </div>
        <SignupModal setModalIsOpen={setModalIsOpen} modalIsOpen={modalIsOpen} />
      </div>
    </>
  );
};

export default LoginForm;
