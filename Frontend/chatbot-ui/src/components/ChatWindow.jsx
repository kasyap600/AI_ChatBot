import { useEffect, useState, useRef } from "react";
import { sendMessage, fetchChatHistory } from "../services/chatApi";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const bottomRef = useRef(null);

  // Load chat history on mount
  useEffect(() => {
    fetchChatHistory().then((data) => {
      const withTime = data.map((msg) => ({
        ...msg,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
      setMessages(withTime);
    });
  }, []);

  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text) => {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Add user message immediately
    const userMsg = {
      userMessage: text,
      aiReply: null,
      time,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await sendMessage(text);

      const aiMsg = {
        ...response,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          userMessage: "",
          aiReply: "Something went wrong. Please try again.",
          time,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`chat-window ${darkMode ? "dark" : ""}`}>
      {/* Header / Dark mode toggle */}
      <div className="chat-header">
        <h3>AI Chatbot</h3>
        <button
          className="dark-toggle"
          onClick={() => setDarkMode((prev) => !prev)}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.userMessage && (
              <MessageBubble
                text={msg.userMessage}
                sender="user"
                time={msg.time}
              />
            )}
            {msg.aiReply && (
              <MessageBubble
                text={msg.aiReply}
                sender="ai"
                time={msg.time}
              />
            )}
          </div>
        ))}

        {loading && (
          <div className="typing-indicator">
            AI is typing<span>.</span><span>.</span><span>.</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
};

export default ChatWindow;
