/* eslint-disable react-refresh/only-export-components */
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TaskManagerPage from "./pages/TaskManagerPage/TaskManagerPage";
import UserHome from "./pages/HomePage/HomePage";
import UserCard from "./components/User/UserCard";

const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage/SignupPage"));

function App() {
  return (
    <Router>
      <Suspense fallback={<span>Loading...</span>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<SignupPage />} />
          <Route path="/home" element={<UserHome />} />
          <Route path="/teamlead" element={<TaskManagerPage />} />
          <Route path="/profile" element={<UserCard />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default React.memo(App);
