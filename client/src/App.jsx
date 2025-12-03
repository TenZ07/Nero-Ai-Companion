import { useEffect, useMemo, useRef, useState } from "react";
import ChatBubble from "./components/ChatBubble";
import MessageInput from "./components/MessageInput";
import TypingIndicator from "./components/TypingIndicator";
import Footer from "./components/Footer";
import { sendChat, getHealth } from "./lib/api";
import "./App.css";

const PROMPTS = [
  "Ask my goals and preferences first, then build a personalized plan.",
  "Ask my subject and level, then explain and quiz me.",
  "Ask project details such as language, features, then generate the code.",
  "Ask tone and purpose first, then write the final content.",
];

const makeId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

function App() {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hey, I'm Nero, your AI co-pilot powered by Google Gemini.",
    },
  ]);
  const [input, setInput] = useState("");
  const [behaviour, setBehaviour] = useState("explainer");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Checking connection…");
  const [isSending, setIsSending] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const chatWindowRef = useRef(null);
  const isAbortedRef = useRef(false);

  const handleBehaviourChange = (newBehaviour) => {
    setBehaviour(newBehaviour);
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hey, I'm Nero, your AI co-pilot powered by Google Gemini.",
      },
    ]);
    setError("");
  };

  useEffect(() => {
    getHealth()
      .then((data) =>
        setStatus(`Connected · Model: ${data?.model ?? "Google AI Studio"}`)
      )
      .catch(() => setStatus("Offline."));
  }, []);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTo({
        top: chatWindowRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSend = async (prefill) => {
    const text = (prefill ?? input).trim();
    if (!text || isSending) return;

    const userMessage = {
      id: makeId(),
      role: "user",
      content: text,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsSending(true);
    isAbortedRef.current = false;

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const payload = nextMessages.map(({ role, content }) => ({
        role,
        content,
      }));

      const data = await sendChat(payload, behaviour, controller.signal);
      const reply = data?.reply || "";
      
      if (!isAbortedRef.current) {
        if (reply) {
          setMessages((prev) => [
            ...prev,
            { id: makeId(), role: "assistant", content: reply },
          ]);
        } else {
          setError("Received empty response from server");
        }
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Response interrupted.");
      } else if (!isAbortedRef.current) {
        setError(err.message || "Something went wrong. Try again.");
      }
    } finally {
      setIsSending(false);
      setAbortController(null);
    }
  };

  const handleInterrupt = () => {
    isAbortedRef.current = true;
    abortController?.abort();
    setAbortController(null);
    setIsSending(false);
  };

  const suggestionButtons = useMemo(
    () =>
      PROMPTS.map((prompt) => (
        <button
          key={prompt}
          className="prompt-chip"
          onClick={() => handleSend(prompt)}
          disabled={isSending}
        >
          {prompt}
        </button>
      )),
    [isSending]
  );

  const hasUserMessages = messages.some((message) => message.role === "user");

  return (
    <div className="app-shell">
      <div className="aurora" />
      <a
        href="https://github.com/TenZ07"
        target="_blank"
        rel="noopener noreferrer"
        className="github-btn"
      >
        <svg
          height="24"
          width="24"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 
          5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49
          -2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
          -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82
          .72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07
          -1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
          -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 
          0 0 1 8 3.72c.68.003 1.36.092 2 .27 1.53-1.03 
          2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 
          1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 
          1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 
          8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
        </svg>
      </a>
      <div className="chat-card">
      <header className="chat-header">
  <div className="header-title-container">
    <img src="/nero-logo.svg" alt="Nero AI Logo" className="header-logo" />
    <div>
      <p className="eyebrow">Nero · AI Companion</p>
      <h1>Ask, explore, create.</h1>
    </div>
  </div>

  <div className="header-controls">
    <select 
      className="behaviour-select" 
      value={behaviour} 
      onChange={(e) => handleBehaviourChange(e.target.value)}
      disabled={isSending}
    >
      <option value="explainer">Explainer</option>
      <option value="brief">Brief</option>
      <option value="sarcastic_humor">Sarcastic Humor</option>
    </select>
    <span className="status">{status}</span>
  </div>
</header>


        <section className="chat-window" ref={chatWindowRef}>
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              role={message.role}
              content={message.content}
            />
          ))}
          {isSending && <TypingIndicator />}
        </section>

        {!hasUserMessages && (
          <section className="prompts reveal">{suggestionButtons}</section>
        )}

        {error && <p className="error-banner">{error}</p>}

        <MessageInput
          value={input}
          onChange={setInput}
          onSend={() => handleSend()}
          disabled={isSending}
          onInterrupt={handleInterrupt}
          canInterrupt={!!abortController}
        />
        <Footer/>
      </div>
    </div>
  );
}

export default App;

