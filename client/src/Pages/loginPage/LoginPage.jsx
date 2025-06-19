import { useState } from "react";
import stars from "../../assets/spark.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/auth/authSlice";

let apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3000";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux auth state
  const { role: storedRole } = useSelector((state) => state.auth);
  const [selectedRole, setSelectedRole] = useState(
    storedRole || sessionStorage.getItem("selectedRole") || null
  );
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Sync Redux + sessionStorage when selecting role
  const selectRole = (role) => {
    setSelectedRole(role);
    sessionStorage.setItem("selectedRole", role);
    dispatch(login({ username: null, role })); // set role in redux
  };

  const continueToPoll = async () => {
    if (!selectedRole) {
      alert("Please select a role.");
      return;
    }

    setLoading(true);

    try {
      if (selectedRole === "teacher") {
        const res = await axios.post(`${apiUrl}/teacher-login`);
        const username = res.data.username;
        sessionStorage.setItem("username", username);
        dispatch(login({ username, role: "teacher" }));
        navigate("/teacher-home-page");
      } else {
        const username = "student-" + Math.floor(Math.random() * 100000); // or ask name on next screen
        sessionStorage.setItem("username", username);
        dispatch(login({ username, role: "student" }));
        navigate("/student-home-page");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="relative min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 to-white dark:from-zinc-900 dark:to-zinc-800 transition-colors">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            background: { color: { value: "transparent" } },
            fullScreen: { enable: false },
            particles: {
              number: { value: 40 },
              size: { value: 3 },
              move: { enable: true, speed: 1 },
              opacity: { value: 0.6 },
              links: {
                enable: true,
                distance: 150,
                color: "#999",
                opacity: 0.4,
              },
            },
          }}
          className="absolute inset-0 z-0"
        />

        <div className="z-10 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 md:p-12 max-w-3xl w-full text-center transition">
          {/* Top Buttons */}
          <div className="flex flex-col sm:flex-row items-center mb-6 gap-4">
            <div className="flex-1 flex justify-center sm:justify-start">
              <button
                aria-label="Intervue Poll"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-700 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-md hover:scale-105 transition-transform"
              >
                <img src={stars} alt="spark" className="w-4 h-4" />
                Intervue Poll
              </button>
            </div>
            <div className="flex-1 flex justify-center sm:justify-end">
              <button
                onClick={toggleDarkMode}
                className="text-sm font-medium px-4 py-2 rounded-full border dark:border-gray-600 border-gray-300 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
              >
                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </button>
            </div>
          </div>

          {/* Content */}
          <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800 dark:text-purple-300">
            Welcome to the{" "}
            <span className="text-purple-700 dark:text-purple-400">
              Live Polling System
            </span>
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            Please select the role that best describes you to begin using the
            live polling system.
          </p>

          {/* Role Cards */}
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-8">
            {["student", "teacher"].map((role) => (
              <div
                key={role}
                role="button"
                tabIndex={0}
                onClick={() => selectRole(role)}
                onKeyDown={(e) => e.key === "Enter" && selectRole(role)}
                className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 border-2 p-6 rounded-xl w-full md:w-1/2 text-left shadow-sm ${
                  selectedRole === role
                    ? "border-purple-600 bg-purple-50 dark:bg-purple-900"
                    : "border-gray-300 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 bg-white dark:bg-zinc-800"
                }`}
              >
                <p className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
                  I’m a {role.charAt(0).toUpperCase() + role.slice(1)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {role === "student"
                    ? "Submit your responses and engage with real-time polls."
                    : "Create polls and view live results instantly."}
                </p>
              </div>
            ))}
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <button
              onClick={continueToPoll}
              className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full text-base font-medium shadow-md hover:shadow-lg hover:scale-105 transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
