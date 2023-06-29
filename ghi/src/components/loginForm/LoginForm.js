import { useGetTokenMutation } from "../../store/Api";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/tokenSlice';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'


let initialData = {
  username: "",
  password: "",
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [getToken] = useGetTokenMutation();
  const dispatch = useDispatch();  // get dispatch
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

  return (
    <>
      <div className="" id="login-form">
        <form onSubmit={handleSubmit}>
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
          <div>
            <p className="">
              Don't have an account?
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
