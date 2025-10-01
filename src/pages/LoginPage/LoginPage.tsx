/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState, useCallback, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../services/popups/popups";
import { userAxios } from "../../Constraints/axiosInterceptor";
import { imageUrls } from "../../constants/strings";
import { validateEmail } from "../../utils/formValidation";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../../slice/userSlice";
import { AppDispatch } from "../../store/store";
import axios from "axios";
import "./LoginPage.css";

interface User {
  userId: string;
  username: string | null;
  email: string | null;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (!token) return;

    const userData: User = {
      userId: localStorage.getItem("userId") ?? "",
      username: localStorage.getItem("userName") ?? "",
      email: localStorage.getItem("userEmail") ?? "",
    };

    dispatch(setUser(userData));
    navigate("/home");
  }, [dispatch, navigate]);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        if (!password || !email) {
          showErrorToast("Please enter both email and password");
          return;
        }

        if (!validateEmail(email)) {
          showErrorToast("Please enter a valid email address");
          return;
        }

        const response = await userAxios.post("/login", {
          email,
          password,
        });

        console.log("response>>>", response);

        if (response.data.userData && response.data.userData.email) {
          const { email, firstname, _id } = response.data.userData;

          // Save to localStorage
          localStorage.setItem("usertoken", response.data.token);
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userName", firstname);
          localStorage.setItem("userId", _id);

          // Update Redux directly
          dispatch(
            setUser({
              userId: _id,
              username: firstname,
              email,
            })
          );

          showSuccessToast("Login Successful");
          setTimeout(() => {
            navigate("/home");
          }, 2300);
        } else {
          showErrorToast("Please check email & password");
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 409) {
          showErrorToast("Password does not match");
        }
        if (axios.isAxiosError(error) && error.response?.status === 408) {
          showErrorToast("Email not exist");
        }
      }
    },
    [email, password, navigate]
  );

  return (
    <section className="login-section" style={{ backgroundImage: `url(${imageUrls.imageUrl1})` }}>
      <div className="login-container">
        <div className="login-header">
          <Suspense fallback={<span>Loading...</span>}>
            <img className="login-logo" src={imageUrls.imageUrl4} alt="logo" />
          </Suspense>
          <h1>Task Management System</h1>
          <ToastContainer />
        </div>

        <div className="login-card">
          <h2>Login to your account</h2>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
            </div>

            <div className="form-group password-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                <span className="toggle-password" onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Sign in
            </button>

            <p className="signup-link">
              Don’t have an account yet? <Link to="/">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default React.memo(LoginPage);
