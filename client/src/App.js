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
        return <StudentDashboard />;
      case 3:
        return <TeacherDashboard />;
      case 4:
        return <AdminDashboard />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

  // If user is trying to access /dashboard and no privateKey, ask for it first
  if (location.pathname.startsWith("/dashboard") && !privateKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-semibold mb-6">Enter your Private Key</h1>
        <input
          type="password"
          value={privateKeyInput}
          onChange={(e) => setPrivateKeyInput(e.target.value)}
          placeholder="Private Key"
          className="border border-gray-400 px-4 py-2 rounded-md mb-4 w-80"
        />
        <button
          onClick={() => setPrivateKey(privateKeyInput)}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          disabled={!privateKeyInput.trim()}
        >
          Submit
        </button>
      </div>
    );
  }

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
