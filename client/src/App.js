import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

import OpenRoute from "./components/Auth/OpenRoute";
import PrivateRoute from "./components/Auth/PrivateRoute";

import StudentDashboard from "./components/StudentDashboard/StudentDashboard";
import GuestDashboard from "./components/GuestDashboard/GuestDashboard";
import TeacherDashboard from "./components/TeacherDashboard/TeacherDashboard";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";

function App() {
  const { type } = useSelector((state) => state.auth);

  const renderDashboard = () => {
    switch (type) {
      case 0:
        return <GuestDashboard />;
      case 1:
        return <StudentDashboard />;
      case 2:
        return <TeacherDashboard />;
      case 3:
        return <AdminDashboard />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/login"
        element={
          <OpenRoute>
            <Login />
          </OpenRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <OpenRoute>
            <Signup />
          </OpenRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      >
        <Route path="my-dashboard" index element={renderDashboard()} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
