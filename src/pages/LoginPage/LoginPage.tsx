/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState, useCallback, Suspense, lazy } from "react";
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
const Spinner = lazy(() => import("../../components/spinner/Spinner"));

interface User {
  userId: string;
  username: string | null;
  email: string | null;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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
    <section
      className="bg-gray-50 dark:bg-gray-900"
      style={{
        backgroundImage: `url(${imageUrls.imageUrl1})`,
        backgroundSize: "cover",
      }}
    >
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <Suspense fallback={<Spinner />}>
            <img className="w-8 h-8 mr-2" src={imageUrls.imageUrl4} alt="logo" />
          </Suspense>
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Task Management System</h1>
          <ToastContainer />
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-semibold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Login to your account</h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <Link to="/" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(LoginPage);
