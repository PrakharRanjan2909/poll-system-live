import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const Chat = ({
  messages,
  newMessage,
  onMessageChange,
  onSendMessage,
  typingUsers,
}) => {
  const username = sessionStorage.getItem("username");
  const chatRef = useRef();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  return (
    <>
      <div
        ref={chatRef}
        className="flex flex-col gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md overflow-y-auto max-h-52"
      >
        {messages.length === 0 && (
          <div className="text-gray-500 text-sm">No messages yet</div>
        )}

        {messages.map((msg, i) => {
          const isSelf = msg.user === username;
          return (
            <div
              key={i}
              className={`flex gap-2 mb-2 ${
                isSelf ? "justify-end" : "justify-start"
              }`}
            >
              {!isSelf && (
                <div className="w-7 h-7 bg-gray-700 dark:bg-gray-600 text-white rounded-full flex items-center justify-center text-xs">
                  {msg.user.charAt(0).toUpperCase()}
                </div>
              )}
              <div
                className={`rounded-lg px-3 py-2 text-sm whitespace-pre-wrap max-w-xs ${
                  isSelf
                    ? "bg-purple-600 text-white"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                <span className="font-semibold mr-1">
                  {isSelf ? "You" : msg.user}:
                </span>
                {msg.text}
              </div>
              {isSelf && (
                <div className="w-7 h-7 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs">
                  {msg.user.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          );
        })}

        {typingUsers.length > 0 && (
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <span>{typingUsers.join(", ")} is typing</span>
            <span className="inline-block w-3 h-3 bg-gray-400 rounded-full animate-bounce"></span>
            <span className="inline-block w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-150"></span>
            <span className="inline-block w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-300"></span>
          </div>
        )}
      </div>

      <div className="mt-2 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Type a message"
          className="flex-1 text-sm px-3 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring focus:ring-purple-400"
        />
        <button
          onClick={onSendMessage}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 rounded-r-md shadow"
        >
          Send
        </button>
      </div>
    </>
  );
};
Chat.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      user: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  newMessage: PropTypes.string.isRequired,
  onMessageChange: PropTypes.func.isRequired,
  onSendMessage: PropTypes.func.isRequired,
  typingUsers: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Chat;
