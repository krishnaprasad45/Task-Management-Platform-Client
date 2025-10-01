/* eslint-disable react-refresh/only-export-components */
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserTaskManagerPage from "./pages/UserTaskManagerPage/UserTaskManagerPage";
import TaskManagerPage from "./pages/TaskManagerPage/TaskManagerPage";
import UserHome from "./pages/HomePage/HomePage";

const Spinner = lazy(()=> import('./components/spinner/Spinner'))
const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage/SignupPage"));
const OTPPage = lazy(() => import("./pages/Otp/OTPPage"));


function App() {
  return (
    <Router>
      <Suspense fallback={<Spinner/>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/" element={<SignupPage />} />
          <Route path="/home" element={<UserHome />} />
          <Route path="/teamlead" element={<TaskManagerPage />} />
          <Route path="/member" element={<UserTaskManagerPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default React.memo(App);
