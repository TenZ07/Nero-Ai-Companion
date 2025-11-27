import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`bubble ${isUser ? "bubble-user" : "bubble-assistant"}`}>
      <div className="bubble-meta">
        {isUser ? "You" : "Nero"}
        <span className="bubble-glow" />
      </div>
      <div className="bubble-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

ChatBubble.propTypes = {
  role: PropTypes.oneOf(["user", "assistant"]).isRequired,
  content: PropTypes.string.isRequired,
};


