import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../../configs/axiosConfig";
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/");
    }
  }, [navigate]);

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await Axios.post("/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("authToken", data.token);
      navigate("/");
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };
  return (
    <div className="">
      <form onSubmit={loginHandler}>
        <h3>Login</h3>
        {error && <span>{error}</span>}

        <div className="form-group">
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            placeholder="Enter email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            placeholder="Enter password"
            required
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Login</button>
        <span>
          <Link to="/register">Don't have an account?</Link>
          <Link to="/forgotpassword">Forgot your password?</Link>
        </span>
      </form>
    </div>
  );
};

export default LoginScreen;
