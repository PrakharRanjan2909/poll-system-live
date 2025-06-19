import { useState, useEffect } from "react";
import io from "socket.io-client";
import ChatPush from "../../components/chat/ChatPush";
import { useNavigate } from "react-router-dom";
import eyeIcon from "../../assets/eye.svg";

let apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3000";

const socket = io(apiUrl);

const PollPageTeacher = () => {
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([]);
  const [votes, setVotes] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("pollCreated", (pollData) => {
      setPollQuestion(pollData.question);
      setPollOptions(pollData.options);
      setVotes({});
    });

    socket.on("pollResults", (updatedVotes) => {
      setVotes(updatedVotes);
      setTotalVotes(Object.values(updatedVotes).reduce((a, b) => a + b, 0));
    });

    return () => {
      socket.off("pollCreated");
      socket.off("pollResults");
    };
  }, []);

  const calculatePercentage = (count) => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };

  const askNewQuestion = () => {
    navigate("/teacher-home-page");
  };

  const handleViewPollHistory = () => {
    navigate("/teacher-poll-history");
  };

  return (
    <>
      <div className="p-4 flex justify-end gap-4">
        <button
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm shadow"
          onClick={handleViewPollHistory}
        >
          <img src={eyeIcon} alt="view" className="w-4 h-4" />
          View Poll History
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-16">
        <h3 className="text-center text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Poll Results
        </h3>

        {pollQuestion ? (
          <>
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-6 mb-6">
              <h4 className="text-lg font-medium text-white bg-gradient-to-r from-gray-800 to-gray-600 px-4 py-2 rounded mb-4">
                {pollQuestion}?
              </h4>
              <div className="space-y-4">
                {pollOptions.map((option) => {
                  const percent = Math.round(
                    calculatePercentage(votes[option.text] || 0)
                  );
                  return (
                    <div key={option.id} className="space-y-1">
                      <div className="flex justify-between text-sm text-gray-700 dark:text-gray-200 font-medium">
                        <span>{option.text}</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition"
                onClick={askNewQuestion}
              >
                + Ask a new question
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            Waiting for the teacher to start a new poll...
          </div>
        )}
        <ChatPush />
      </div>
    </>
  );
};

export default PollPageTeacher;
