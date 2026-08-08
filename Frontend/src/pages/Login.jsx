import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  const success = await login(formData.email, formData.password);

  if (success) {
    navigate("/dashboard");
  } else {
    setError("Invalid Email or Password");
  }
};
  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-header">
          <h1>RBAC System</h1>
          <p>Role & Permission Management</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

          </div>

          {error && (
            <p
              style={{
                color: "red",
                marginBottom: "15px",
                fontSize: "14px",
              }}
            >
              {error}
            </p>
          )}

          <button type="submit">
            Login
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;