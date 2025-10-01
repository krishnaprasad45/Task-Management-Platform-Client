/* eslint-disable react-refresh/only-export-components */

import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAxios } from "../../Constraints/axiosInterceptor";
import { showErrorToast, showSuccessToast } from "../../services/popups/popups";
import { ToastContainer } from "react-toastify";
import { imageUrls } from "../../constants/strings";
import { validateEmail, validatePassword } from "../../utils/formValidation";
import axios from "axios";
import './SignupPage.css'

const SignupPage: React.FC = function SignupPage() {
  const [firstname, setFirstName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      setEmailError(null);
      setPasswordError(null);

      if (firstname.length <= 3 ) {
        setNameError("Minimum 4 characters required!");
        return;
      }
      if (!validateEmail(email)) {
        setEmailError("Enter valid email!");
        return;
      }

      if (!validatePassword(password)) {
        setPasswordError("Password must be at least 8 characters long!");
        return;
      }

      if (password !== confirmPassword) {
        showErrorToast("Passwords should match!");
        return;
      }

      try {
        await userAxios.post("/signup", { firstname,email, password });
        navigate("/login", { state: { data: email } });
        showSuccessToast("Otp sent");
      } catch (error) {
        console.error("There was an error signing up!", error);

        if (axios.isAxiosError(error) && error.response?.status === 409) {
          showErrorToast("Email already exists");
        } else {
          showErrorToast("Signup failed, please try again.");
        }
      }
    },
    [email, password, confirmPassword, navigate]
  );

  return (
   <section
      className="signup-section"
      style={{ backgroundImage: `url(${imageUrls.imageUrl3})` }}
    >
      <div className="signup-container">
        <div className="signup-header">
          <img className="signup-logo" src={imageUrls.imageUrl4} alt="logo" />
          <h1>Task Management System</h1>
          <ToastContainer />
        </div>

        <div className="signup-card">
          <h2>Create an account</h2>
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label htmlFor="firstname">Your Name</label>
              <input
                type="text"
                id="firstname"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                className={nameError ? "input-error" : ""}
                placeholder="John Doe"
              />
              {nameError && <span className="error-text">{nameError}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={emailError ? "input-error" : ""}
                placeholder="name@example.com"
              />
              {emailError && <span className="error-text">{emailError}</span>}
            </div>

            
            <div className="form-group password-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={passwordError ? "input-error" : ""}
                  placeholder="••••••••"
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
              {passwordError && <span className="error-text">{passwordError}</span>}
            </div>

            {/* Confirm Password Field */}
            <div className="form-group password-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Create an account
            </button>

            <p className="login-link">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </section>

  );
};

export default React.memo(SignupPage);
