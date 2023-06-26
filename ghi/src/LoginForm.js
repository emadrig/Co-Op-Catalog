import { useGetTokenMutation } from "./store/Api";
import { useState } from "react";
import { useDispatch } from 'react-redux';  // import useDispatch
import { setToken } from './store/tokenSlice'; // import setToken action
import { useNavigate } from 'react-router-dom';


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
      <div className="ms-auto me-auto shadow p-4 rounded" id="login-form">
        <form onSubmit={handleSubmit}>
          <h1 className="fw-bold">User Login</h1>
          <div className="mb-3">
            <input
              autoFocus
              onChange={handleChange}
              value={formData.name}
              placeholder="Username"
              required
              type="text"
              name="username"
              className="form-control fs-2 border border-3 border-dark"
            />
          </div>
          <div className="mb-3">
            <input
              onChange={handleChange}
              value={formData.password}
              placeholder="Password"
              required
              type="password"
              name="password"
              autoComplete="on"
              className="form-control fs-2 border border-3 border-dark"
            />
          </div>
          <div className="mb-3">
            <button
              className="btn fw-bold fs-2 border border-dark border-3 rounded"
              id="login-button"
            >
              Login
            </button>
          </div>
          <div>
            <p className="fs-2">
              Don't have an account?
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
