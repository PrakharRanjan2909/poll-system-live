import { useState } from "react";
import stars from "../../assets/spark.svg";
import { useNavigate } from "react-router-dom";

const StudentHomePage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleStudentLogin = async (e) => {
    e.preventDefault();

    if (name.trim()) {
      try {
        sessionStorage.setItem("username", name);
        navigate("/poll-question");
      } catch (error) {
        console.error("Error logging in student:", error);
        alert("Error connecting to the server. Please try again.");
      }
    } else {
      alert("Please enter your name");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-neutral-950">
      <div className="w-full max-w-xl bg-white dark:bg-neutral-900 text-black dark:text-white p-8 rounded-xl shadow-xl">
        {/* Logo Button */}
        <div className="flex justify-center mb-6">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-purple-500 to-indigo-700 shadow">
            <img src={stars} alt="Intervue" className="w-4 h-4" />
            Intervue Poll
          </button>
        </div>

        {/* Header Text */}
        <h3 className="text-2xl font-bold text-center mb-2">
          Let&#39;s <b>Get Started</b>
        </h3>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          If you&#39;re a student, you&#39;ll be able to{" "}
          <b className="text-black dark:text-white">submit your answers</b>,
          participate in live polls, and see how your responses compare with
          your classmates.
        </p>

        {/* Form */}
        <form onSubmit={handleStudentLogin}>
          <div className="w-full">
            <label className="block mb-1 font-medium text-left">
              Enter your Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring focus:ring-purple-400"
              required
              onChange={(e) => setName(e.target.value)}
            />
            <button
              type="submit"
              className="w-full mt-5 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium shadow hover:scale-105 transition"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentHomePage;
