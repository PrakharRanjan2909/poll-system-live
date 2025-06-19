import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backIcon from "../../assets/back.svg";

let apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3000";

const PollHistoryPage = () => {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getPolls = async () => {
      const username = sessionStorage.getItem("username");
      try {
        const response = await axios.get(`${apiUrl}/polls/${username}`);
        setPolls(response.data.data);
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };

    getPolls();
  }, []);

  const calculatePercentage = (count, totalVotes) => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };

  const handleBack = () => {
    navigate("/teacher-home-page");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <img
          src={backIcon}
          alt="Back"
          width={24}
          onClick={handleBack}
          className="cursor-pointer hover:scale-105 transition"
        />
        <span className="text-lg font-semibold text-gray-800 dark:text-white">
          View <b className="text-purple-600">Poll History</b>
        </span>
      </div>

      {polls.length > 0 ? (
        polls.map((poll, index) => {
          const totalVotes = poll.options.reduce(
            (sum, option) => sum + option.votes,
            0
          );

          return (
            <div
              key={poll._id}
              className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6 mb-6"
            >
              <p className="text-sm text-gray-500 mb-2">Question {index + 1}</p>
              <h4 className="bg-gradient-to-r from-gray-800 to-gray-600 text-white px-4 py-2 rounded text-base font-semibold mb-4">
                {poll.question}?
              </h4>
              <div className="space-y-4">
                {poll.options.map((option) => {
                  const percent = Math.round(
                    calculatePercentage(option.votes, totalVotes)
                  );
                  return (
                    <div key={option._id} className="space-y-1">
                      <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-200">
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
          );
        })
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
          No polls found.
        </div>
      )}
    </div>
  );
};

export default PollHistoryPage;
