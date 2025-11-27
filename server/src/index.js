import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MODEL_NAME = process.env.GOOGLE_MODEL;

app.use(cors());
app.use(express.json());

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.warn(
    "⚠️  GOOGLE_API_KEY is not set. The chatbot endpoint will fail until you provide it."
  );
}

const normalizeHistory = (messages = []) => {
  const safeMessages = messages.filter((msg) => msg?.role && msg?.content);

  // Gemini requires the first entry to be from the user. Drop leading assistant/system msgs.
  const firstUserIndex = safeMessages.findIndex((msg) => msg.role === "user");
  const ordered =
    firstUserIndex === -1 ? [] : safeMessages.slice(firstUserIndex);

  return ordered.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));
};

app.get("/health", (_req, res) => {
  res.json({ status: "ok", model: MODEL_NAME });
});

app.post("/api/chat", async (req, res) => {
  const { messages = [] } = req.body;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing GOOGLE_API_KEY" });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return res
      .status(400)
      .json({ error: "messages array with at least one entry is required" });
  }

  const latestMessage = messages[messages.length - 1];

  if (latestMessage?.role !== "user" || !latestMessage?.content?.trim()) {
    return res
      .status(400)
      .json({ error: "Last message must be a non-empty user message" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const history = normalizeHistory(messages.slice(0, -1));
    const latest = latestMessage.content.trim();

    const chatSession = model.startChat({ history });
    const result = await chatSession.sendMessage(latest);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("Chat route error:", error);
    res.status(500).json({
      error: "Failed to fetch response from Google AI Studio",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


