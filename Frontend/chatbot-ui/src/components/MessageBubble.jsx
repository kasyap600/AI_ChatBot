const MessageBubble = ({ text, sender, time }) => {
  return (
    <div className={`bubble ${sender}`}>
      <div className="bubble-text">{text}</div>
      <div className="timestamp">{time}</div>
    </div>
  );
};

export default MessageBubble;
