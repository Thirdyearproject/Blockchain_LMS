import { React, useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import OpenRoute from "./components/Auth/OpenRoute";
import PrivateRoute from "./components/Auth/PrivateRoute";
function App() {
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
        {/* <Route index element={<Navigate to="my-dashboard" replace />} />
        <Route path="my-dashboard" element={<StudentDashboard />} /> */}
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
