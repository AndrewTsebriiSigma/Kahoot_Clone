import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles/Login.css'
import logo from '../assets/logo.jpg'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role (Teacher or Student).");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        if (role === "teacher") {
          navigate("/quizzes"); // direct to quizzes page
        } else if (role === "student") {
          navigate("/join-page"); // direct to join page
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
  };

  return (<div className="login-page">
    <div className="image"><img src={logo} alt="" /></div>

    <div className="container">
      <h2>Hello! Sign in to your account</h2>
      <form onSubmit={handleSubmit}>
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
        <div>
          <label>
            <input
              type="radio"
              name="role"
              value="teacher"
              checked={role === "teacher"}
              onChange={handleRoleChange}
            />{" "}
            Teacher
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="student"
              checked={role === "student"}
              onChange={handleRoleChange}
            />{" "}
            Student
          </label>
        </div>
        <button type="submit">Sign In</button>
      </form>

      <h3>
        Don't have an account?{" "}
        <a onClick={() => navigate("/register")} style={{ cursor: "pointer" }}>
          Create
        </a>
      </h3>
    </div>
    </div>
  );
};

export default Login;
