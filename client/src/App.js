import { React, useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { JsonRpcProvider } from "ethers";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import OpenRoute from "./components/Auth/OpenRoute";
import PrivateRoute from "./components/Auth/PrivateRoute";
function App() {
  const [provider, setProvider] = useState(null);
  useEffect(() => {
    const initializeProvider = async () => {
      try {
        const provider = new JsonRpcProvider("http://127.0.0.1:8545");
        setProvider(provider);
        console.log("Provider initialized");
      } catch (error) {
        console.error("Provider initialization error:", error);
      }
    };

    initializeProvider();
  }, []);

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
        <Route index element={<Navigate to="my-dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
