import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles/Login.css'
import logo from '../assets/logo.jpg'

const Registration = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to manage error messages
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  const apiUrl = import.meta.env.VITE_BE_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword || !role) {
      setErrorMessage("Please fill in all fields.");
      setShowPopup(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setShowPopup(true);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, role }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed, please try again.");
      }

      const data = await response.json();

      if (data.message) {
        alert(data.message || "Registration successful!");
        navigate("/login");
      } else {
        throw new Error("An unexpected error occurred during registration.");
      }
    } catch (error) {
      setErrorMessage(error.message); // Set the error message
      setShowPopup(true); // Show the popup
    }
  };

  return (
    <div className="login-page">
      <div className="image"><img src={logo} alt="" /></div>
      <div className="container">
        <h2>Create an account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            required
          />
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <br />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          <br />
          <div>
            <label>
              <input
                type="radio"
                name="role"
                value="teacher"
                checked={role === "teacher"}
                onChange={(e) => setRole(e.target.value)}
              />{" "}
              Teacher
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === "student"}
                onChange={(e) => setRole(e.target.value)}
              />{" "}
              Student
            </label>
          </div>
          <button type="submit">Register</button>
        </form>

        <h3>
          Already have an account? <a onClick={() => navigate("/login")}>Login</a>
        </h3>

        {/* Popup for errors */}
        {showPopup && (
          <div style={popupStyle}>
            <p>{errorMessage}</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

// Popup styles (can be moved to CSS file if preferred)
const popupStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: "20px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  zIndex: 1000,
};

export default Registration;
