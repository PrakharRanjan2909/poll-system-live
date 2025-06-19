import { useState } from "react";
import stars from "../../assets/spark.svg";
import eyeIcon from "../../assets/eye.svg";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

let apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3000";

const socket = io(apiUrl);

const TeacherHomePage = () => {
  const { username } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ id: 1, text: "", correct: null }]);
  const [timer, setTimer] = useState("60");
  const [error, setError] = useState("");

  const handleQuestionChange = (e) => setQuestion(e.target.value);
  const handleTimerChange = (e) => setTimer(e.target.value);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index].text = value;
    setOptions(updated);
  };

  const handleCorrectToggle = (index, isCorrect) => {
    const updated = [...options];
    updated[index].correct = isCorrect;
    setOptions(updated);
  };

  const deleteOption = (index) => {
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated.length ? updated : [{ id: 1, text: "", correct: null }]);
  };

  const addOption = () => {
    setOptions([
      ...options,
      { id: options.length + 1, text: "", correct: null },
    ]);
  };

  const resetForm = () => {
    setQuestion("");
    setOptions([{ id: 1, text: "", correct: null }]);
    setTimer("60");
    setError("");
  };

  const validateForm = () => {
    if (question.trim() === "") {
      setError("Question cannot be empty");
      return false;
    }
    if (options.length < 2) {
      setError("At least two options are required");
      return false;
    }
    if (options.some((opt) => opt.text.trim() === "")) {
      setError("All options must have text");
      return false;
    }
    if (!options.some((opt) => opt.correct === true)) {
      setError("At least one correct option must be selected");
      return false;
    }
    setError("");
    return true;
  };

  const askQuestion = () => {
    if (validateForm()) {
      const pollData = {
        question,
        options,
        timer,
        teacherUsername: username,
      };
      socket.emit("createPoll", pollData);
      navigate("/teacher-poll");
    }
  };

  const handleViewPollHistory = () => {
    navigate("/teacher-poll-history");
  };

  return (
    <div className="px-6 py-4 animate-fade-in min-h-screen bg-gray-50 dark:bg-neutral-950">
      {/* View Poll History */}
      <div className="flex justify-end mb-4">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow hover:scale-105 transition"
          onClick={handleViewPollHistory}
        >
          <img src={eyeIcon} alt="View" className="w-4 h-4" />
          View Poll History
        </button>
      </div>

      {/* Main Card */}
      <div className="flex justify-center">
        <div className="w-full max-w-4xl bg-white dark:bg-neutral-900 text-black dark:text-white p-8 rounded-xl shadow-xl h-auto border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <button className="flex items-center gap-2 mb-4 px-4 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-purple-500 to-indigo-700 shadow">
            <img src={stars} alt="Intervue" className="w-4 h-4" />
            Intervue Poll
          </button>

          <h2 className="text-2xl font-bold mb-1">
            Let’s <strong>Get Started</strong>
          </h2>
          <p className="font-medium mb-1">Teacher: {username}</p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You can create polls, ask questions, and view results in real time.
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          {/* Question Input */}
          <div className="mb-6 animate-slide-up">
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="question"
                className="font-medium text-gray-800 dark:text-white"
              >
                Enter your question
              </label>
              <select
                className="border rounded px-3 py-1 text-sm dark:bg-neutral-800 dark:text-white"
                value={timer}
                onChange={handleTimerChange}
              >
                <option value="60">60 seconds</option>
                <option value="30">30 seconds</option>
                <option value="90">90 seconds</option>
              </select>
            </div>
            <input
              type="text"
              id="question"
              maxLength="100"
              placeholder="Type your question..."
              className="w-full p-3 rounded bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring focus:ring-purple-400"
              value={question}
              onChange={handleQuestionChange}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {question.length}/100
            </div>
          </div>

          {/* Option List */}
          <div className="mb-6 animate-slide-up">
            <div className="flex justify-between items-center mb-3">
              <label className="font-medium text-gray-800 dark:text-white">
                Edit Options
              </label>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Is it correct?
              </span>
            </div>

            {options.map((option, index) => (
              <div
                key={option.id}
                className="flex items-center mb-3 transition-all"
              >
                <div className="w-7 h-7 flex items-center justify-center text-white font-semibold rounded-full bg-gradient-to-br from-purple-500 to-purple-800 mr-3">
                  {index + 1}
                </div>
                <input
                  type="text"
                  className="flex-1 mr-3 p-2 rounded bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-gray-600"
                  placeholder="Option text..."
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                <div className="flex gap-2 text-sm mr-2">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      className="text-purple-600 focus:ring-purple-400"
                      name={`correct-${index}`}
                      checked={option.correct === true}
                      onChange={() => handleCorrectToggle(index, true)}
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      className="text-purple-600 focus:ring-purple-400"
                      name={`correct-${index}`}
                      checked={option.correct === false}
                      onChange={() => handleCorrectToggle(index, false)}
                    />
                    No
                  </label>
                </div>
                <button
                  onClick={() => deleteOption(index)}
                  className="text-sm text-red-600 font-bold hover:underline ml-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Add + Reset */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={addOption}
              className="px-4 py-2 border border-purple-600 text-purple-600 rounded hover:bg-purple-50 transition"
            >
              + Add More Option
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100 transition"
            >
              Reset Form
            </button>
          </div>

          {/* Ask Button */}
          <div className="flex justify-end">
            <button
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow hover:scale-105 transition"
              onClick={askQuestion}
            >
              Ask Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHomePage;
