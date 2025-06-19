import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import stopwatch from "../../assets/stopwatch.svg";
import stars from "../../assets/spark.svg";
import ChatPush from "../../components/chat/ChatPush";

const apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3000";
const socket = io(apiUrl);

const PollPageStudent = () => {
  const [votes, setVotes] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([]);
  const [pollId, setPollId] = useState("");
  const [kickedOut, setKickedOut] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    const username = sessionStorage.getItem("username");
    if (selectedOption && username) {
      socket.emit("submitAnswer", {
        username,
        option: selectedOption,
        pollId,
      });
      setSubmitted(true);
    } else {
      console.error("Missing username or option.");
    }
  };

  const calculatePercentage = (count) => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };

  useEffect(() => {
    const handleKickedOut = () => {
      setKickedOut(true);
      sessionStorage.removeItem("username");
      navigate("/kicked-out");
    };

    socket.on("kickedOut", handleKickedOut);

    return () => socket.off("kickedOut", handleKickedOut);
  }, [navigate]);

  useEffect(() => {
    socket.on("pollCreated", (pollData) => {
      setPollQuestion(pollData.question);
      setPollOptions(pollData.options);
      setVotes({});
      setSubmitted(false);
      setSelectedOption(null);
      setTimeLeft(pollData.timer);
      setPollId(pollData._id);
    });

    socket.on("pollResults", (updatedVotes) => {
      setVotes(updatedVotes);
    });

    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [timeLeft, submitted]);

  return (
    <>
      <ChatPush />
      {kickedOut ? (
        <div className="text-center mt-20 text-red-600 font-semibold">
          You have been removed.
        </div>
      ) : (
        <>
          {pollQuestion === "" && timeLeft === 0 ? (
            <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gray-50 dark:bg-neutral-950">
              <div className="max-w-xl text-center bg-white dark:bg-neutral-900 rounded-xl p-8 shadow">
                <button className="flex items-center gap-2 mx-auto mb-6 text-white bg-gradient-to-r from-purple-600 to-indigo-700 px-4 py-2 rounded-full">
                  <img src={stars} className="w-4 h-4" alt="" />
                  Intervue Poll
                </button>
                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-white">
                  <b>Wait for the teacher to ask a question...</b>
                </h3>
              </div>
            </div>
          ) : (
            <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex justify-center pt-12 px-4">
              <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-xl shadow-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-lg font-medium text-gray-800 dark:text-white">
                    Question
                  </h5>
                  <div className="flex items-center gap-2 text-sm text-red-600 font-semibold">
                    <img src={stopwatch} alt="timer" className="w-4 h-4" />
                    {timeLeft}s
                  </div>
                </div>

                <div className="mb-4">
                  <p className="bg-gradient-to-r from-gray-700 to-gray-500 text-white p-3 rounded font-medium">
                    {pollQuestion}
                  </p>
                </div>

                {/* Poll Options */}
                <div className="flex flex-col gap-3">
                  {pollOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`p-3 rounded border transition cursor-pointer ${
                        selectedOption === option.text
                          ? "border-purple-600 bg-purple-50 dark:bg-purple-900"
                          : "border-gray-300 dark:border-gray-700"
                      } ${
                        submitted || timeLeft === 0
                          ? "cursor-not-allowed opacity-70"
                          : ""
                      }`}
                      onClick={() =>
                        !submitted &&
                        timeLeft > 0 &&
                        handleOptionSelect(option.text)
                      }
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800 dark:text-white font-medium">
                          {option.text}
                        </span>
                        {submitted && (
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {Math.round(
                              calculatePercentage(votes[option.text] || 0)
                            )}
                            %
                          </span>
                        )}
                      </div>
                      {submitted && (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                          <div
                            className="h-2 rounded-full bg-purple-600 transition-all"
                            style={{
                              width: `${calculatePercentage(
                                votes[option.text] || 0
                              )}%`,
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Submit */}
                {!submitted && selectedOption && timeLeft > 0 && (
                  <div className="mt-6 flex justify-end">
                    <button
                      className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                )}

                {/* After submit message */}
                {submitted && (
                  <div className="mt-6 text-center text-gray-600 dark:text-gray-400 font-medium">
                    Wait for the teacher to ask a new question...
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default PollPageStudent;
