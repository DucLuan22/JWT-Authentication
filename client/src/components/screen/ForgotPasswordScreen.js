import React, { useState } from "react";
import Axios from "../../configs/axiosConfig";
const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const forgotPasswordHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await Axios.post("/api/auth/forgotpassword", { email });
      setSuccess(data.data);
    } catch (error) {
      setError(error.response.data.error);
      setEmail("");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className="forgotpassword-screen">
      <form onSubmit={forgotPasswordHandler}>
        <h3>Forgot Password</h3>
        {error && <span>{error}</span>}
        {success && <span>{success}</span>}
        <div className="form-group">
          <p className="forgotpassword-screen__subtext">
            Please enter the email address you register your account with. We
            will send you reset password confirmation to this email
          </p>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            required
            id="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">Send Email</button>
      </form>
    </div>
  );
};

export default ForgotPasswordScreen;
