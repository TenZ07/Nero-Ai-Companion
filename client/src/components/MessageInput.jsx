import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

export default function MessageInput({
  value,
  onChange,
  onSend,
  disabled,
  onInterrupt,
  canInterrupt,
  placeholder = "Ask me anything...",
}) {
  const textareaRef = useRef(null);

  const adjustHeight = (element) => {
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 160)}px`;
  };

  useEffect(() => {
    adjustHeight(textareaRef.current);
  }, [value]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!disabled && value.trim()) {
      onSend();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter") return;
    if (event.ctrlKey) {
      return; // allow newline
    }

    event.preventDefault();
    if (!disabled && value.trim()) {
      onSend();
    }
  };

  const handleChange = (event) => {
    adjustHeight(event.target);
    onChange(event.target.value);
  };

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        className="composer-field"
        rows={1}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      {canInterrupt ? (
        <button
          type="button"
          className="composer-stop"
          onClick={onInterrupt}
          aria-label="Stop response"
        >
          <span className="sr-only">Stop response</span>
        </button>
      ) : (
        <button className="composer-send" type="submit" disabled={disabled || !value.trim()}>
          <span className="sr-only">{disabled ? "Thinking..." : "Send"}</span>
        </button>
      )}
    </form>
  );
}

MessageInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  onInterrupt: PropTypes.func,
  canInterrupt: PropTypes.bool,
  placeholder: PropTypes.string,
};
