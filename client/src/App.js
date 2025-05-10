import React, { useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import OpenRoute from "./components/Auth/OpenRoute";
import PrivateRoute from "./components/Auth/PrivateRoute";

import StudentDashboard from "./components/StudentDashboard/StudentDashboard";
import GuestDashboard from "./components/GuestDashboard/GuestDashboard";
import TeacherDashboard from "./components/TeacherDashboard/TeacherDashboard";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";

import BookUpload from "./components/BookUpload";
import Books from "./components/Books";
import RegisterUser from "./components/RegisterUser";
import UpdateClearance from "./components/UpdateClearance";
import VoteOnBooks from "./components/VoteOnBooks";

function App() {
  const { type, user } = useSelector((state) => state.auth);
  const [privateKey, setPrivateKey] = useState("");
  const [privateKeyInput, setPrivateKeyInput] = useState("");

  const location = useLocation();

  const renderDashboard = () => {
    switch (type) {
      case 1:
        return <GuestDashboard />;
      case 2:
        return (
          <StudentDashboard
            privateKey={privateKey}
            setPrivateKey={setPrivateKey}
          />
        );
      case 3:
        return (
          <TeacherDashboard
            privateKey={privateKey}
            setPrivateKey={setPrivateKey}
          />
        );
      case 4:
        return (
          <AdminDashboard
            privateKey={privateKey}
            setPrivateKey={setPrivateKey}
          />
        );
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
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      >
        {/* Landing route */}
        <Route path="my-dashboard" index element={renderDashboard()} />

        {/* Admin routes inside dashboard */}
        <Route
          path="my-dashboard/upload"
          element={<BookUpload account={user} privateKey={privateKey} />}
        />
        <Route
          path="my-dashboard/books"
          element={<Books account={user} privateKey={privateKey} />}
        />
        <Route
          path="my-dashboard/register-user"
          element={<RegisterUser account={user} privateKey={privateKey} />}
        />
        <Route
          path="my-dashboard/update-clearance"
          element={<UpdateClearance account={user} privateKey={privateKey} />}
        />
        <Route
          path="my-dashboard/vote-books"
          element={<VoteOnBooks account={user} privateKey={privateKey} />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
