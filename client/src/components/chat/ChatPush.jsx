import { useState, useEffect, useRef } from "react";
import Chat from "./Chat";
import { io } from "socket.io-client";
import chatIcon from "../../assets/chat.svg";

let apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3000";
const socket = io(apiUrl);

const ChatPush = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [openTab, setOpenTab] = useState("chat");
  const [open, setOpen] = useState(false);
  const username = sessionStorage.getItem("username");
  const chatWindowRef = useRef();

  useEffect(() => {
    socket.emit("joinChat", { username });

    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", (user) => {
      if (user !== username) {
        setTypingUsers((prev) =>
          prev.includes(user) ? prev : [...prev, user]
        );
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u !== user));
        }, 1500);
      }
    });

    socket.on("participantsUpdate", (list) => {
      setParticipants(list);
    });

    return () => {
      socket.off("chatMessage");
      socket.off("typing");
      socket.off("participantsUpdate");
    };
  }, [username]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, openTab]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const msg = { user: username, text: newMessage };
      socket.emit("chatMessage", msg);
      // setMessages((prev) => [...prev, msg]);
      setNewMessage("");
    }
  };

  const handleChange = (value) => {
    setNewMessage(value);
    socket.emit("typing", username);
  };

  const handleKickOut = (participant) => {
    socket.emit("kickOut", participant);
  };

  return (
    <>
      <div
        className="fixed bottom-5 right-5 p-3 bg-purple-600 rounded-full cursor-pointer shadow-lg hover:bg-purple-700 transition"
        onClick={() => setOpen(!open)}
      >
        <img src={chatIcon} alt="Chat" className="w-8 h-8" />
      </div>

      {open && (
        <div
          ref={chatWindowRef}
          className="fixed bottom-20 right-5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 w-96 h-96 rounded-lg shadow-lg flex flex-col overflow-hidden animate-slide-up"
          role="dialog"
        >
          <nav className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setOpenTab("chat")}
              className={`flex-1 py-2 ${
                openTab === "chat"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500"
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setOpenTab("participants")}
              className={`flex-1 py-2 ${
                openTab === "participants"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500"
              }`}
            >
              Participants
            </button>
          </nav>

          <div className="flex-1 p-3 overflow-y-auto">
            {openTab === "chat" ? (
              <Chat
                messages={messages}
                newMessage={newMessage}
                onMessageChange={handleChange}
                onSendMessage={handleSendMessage}
                typingUsers={typingUsers.filter((u) => u !== username)}
              />
            ) : (
              <div className="space-y-2">
                {participants.length === 0 ? (
                  <div className="text-gray-500 text-sm">
                    No participants connected
                  </div>
                ) : (
                  participants.map((p, i) => {
                    const isTeacher = p.startsWith("teacher");
                    return (
                      <div
                        key={i}
                        className="flex justify-between items-center py-1"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-300 rounded-full flex-shrink-0 flex items-center justify-center text-xs text-white">
                            {p.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-gray-800 dark:text-gray-200">
                            {p}
                          </span>
                        </div>
                        {username.startsWith("teacher") && !isTeacher && (
                          <button
                            className="text-red-600 text-sm hover:underline"
                            onClick={() => handleKickOut(p)}
                          >
                            Kick
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPush;
