import { useState } from "react";

const ChatInput = ({ onSend,disabled }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
  };

  return (
    <div className="chat-input">
      <textarea
        type="text"
        placeholder="Type a message..."
        value={message}
        disabled={disabled}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button onClick={handleSend} disabled={disabled}>
        Send
      </button>
    </div>
  );
};

export default ChatInput;
