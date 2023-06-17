import { useLogInMutation } from './store/Api.js'
import { useState } from "react";

let initialData = {
  username: "",
  password: "",
};

const LoginForm = () => {
  const [logIn] = useLogInMutation();
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await logIn(formData);
    if (response.error) {
      alert("Incorrect Password or Username");
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
