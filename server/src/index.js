import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MODEL_NAME = process.env.GOOGLE_MODEL;
const apiKey = process.env.GOOGLE_API_KEY;
const openRouterApiKey = process.env.OPENROUTER_API_KEY;

app.use(cors());
app.use(express.json());

if (!apiKey) {
  console.warn("GOOGLE_API_KEY is not set.");
}

if (!openRouterApiKey) {
  console.warn("OPENROUTER_API_KEY is not set.");
}

const BEHAVIOURS = {
  explainer: {
    system:
      "You are a friendly and patient teacher. Explain concepts step-by-step with short examples. Use simple language.",
    generationConfig: {
      temperature: 0.2,
      topP: 0.95,
      maxOutputTokens: 4096
    },
    examples: [
      {
        role: "model",
        parts: [
          {
            text:
              "User: How do I center a div?\nAssistant: Use margin:auto and a width. Example:\n<code>div { width: 300px; margin: 0 auto; }</code>"
          }
        ]
      }
    ]
  },

  brief: {
    system:
      "You are a concise assistant. Answer in up to 3 short bullet points. No extra chit-chat.",
    generationConfig: {
      temperature: 0.0,
      topP: 0.8,
      maxOutputTokens: 2048
    },
    examples: []
  },

  json_api: {
    system:
      "You are a JSON generator. For any question, output a single valid JSON object with keys: intent, answer. No surrounding text.",
    generationConfig: {
      temperature: 0.0,
      topP: 0.9,
      maxOutputTokens: 2048
    },
    examples: []
  },

  sarcastic_humor: {
    system:
      "You are a witty, sarcastic assistant who answers with dry humor, harmless jokes, and playful teasing. Keep responses helpful but deliver them with a slightly annoyed tone, like you're dealing with someone who can't read tooltips. Avoid insults and avoid hateful, sexual, or violent content. Keep the humor clever, not rude.",
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 4096
    },
    examples: [
      {
        role: "model",
        parts: [
          {
            text:
              "User: What is JavaScript?\nAssistant: A language that lets browsers do more than stare blankly at HTML. Think of it as the overworked intern of the internet."
          }
        ]
      },
      {
        role: "model",
        parts: [
          {
            text:
              "User: Why is my code not working?\nAssistant: Because computers enjoy suffering, and yours sensed fear. But fine, let's debug it."
          }
        ]
      }
    ]
  }
};


const normalizeHistory = (messages = []) => {
  const safeMessages = messages.filter((msg) => msg?.role && msg?.content);

  const firstUserIndex = safeMessages.findIndex((msg) => msg.role === "user");
  const ordered = firstUserIndex === -1 ? [] : safeMessages.slice(firstUserIndex);

  return ordered.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }]
  }));
};

// Helper function to call OpenRouter API
const callOpenRouter = async (messages, behaviour, model) => {
  const preset = BEHAVIOURS[behaviour] || BEHAVIOURS.explainer;
  
  // Convert messages to OpenRouter format
  const openRouterMessages = messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
  
  // Add system message at the beginning
  openRouterMessages.unshift({
    role: "system",
    content: preset.system
  });

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openRouterApiKey}`,
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "Nero AI Chatbot",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model,
      messages: openRouterMessages,
      temperature: preset.generationConfig.temperature,
      top_p: preset.generationConfig.topP,
      max_tokens: preset.generationConfig.maxOutputTokens
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

app.get("/health", (_req, res) => {
  res.json({ status: "ok", model: MODEL_NAME });
});

app.post("/api/chat", async (req, res) => {
  const { messages = [], behaviour = "explainer", model } = req.body;
  const selectedModel = model || MODEL_NAME;

  console.log(`[CHAT REQUEST] Model: ${selectedModel} | Behaviour: ${behaviour}`);

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array with at least one entry is required" });
  }

  const latestMessage = messages[messages.length - 1];

  if (latestMessage?.role !== "user" || !latestMessage?.content?.trim()) {
    return res.status(400).json({ error: "Last message must be a non-empty user message" });
  }

  const preset = BEHAVIOURS[behaviour] || BEHAVIOURS.explainer;

  try {
    // Check if this is an OpenRouter model
    const isOpenRouterModel = selectedModel.includes("qwen") || selectedModel.includes("/");
    
    if (isOpenRouterModel) {
      // Use OpenRouter API
      if (!openRouterApiKey) {
        return res.status(500).json({ error: "Missing OPENROUTER_API_KEY" });
      }
      
      console.log(`[OPENROUTER] Using model: ${selectedModel}`);
      const reply = await callOpenRouter(messages, behaviour, selectedModel);
      
      console.log(`[CHAT SUCCESS] Model: ${selectedModel} | Response length: ${reply.length} chars`);
      res.json({ reply, model: selectedModel });
    } else {
      // Use Google Gemini API
      if (!apiKey) {
        return res.status(500).json({ error: "Missing GOOGLE_API_KEY" });
      }
    const genAI = new GoogleGenerativeAI(apiKey);
    
    console.log(`[MODEL CONFIG] Initializing with model: ${selectedModel}`);
    
    const modelConfig = {
      model: selectedModel,
      systemInstruction: preset.system,
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE"
        }
      ]
    };
    
    const generativeModel = genAI.getGenerativeModel(modelConfig);
    const allHistory = normalizeHistory(messages.slice(0, -1));
    const historyFromClient = allHistory.slice(-10);

    // Set appropriate token limits based on model
    const isFlashModel = selectedModel.includes('flash');
    const isProModel = selectedModel.includes('pro');
    
    let finalMaxTokens = preset.generationConfig.maxOutputTokens;
    
    // Override with model-specific limits if needed
    if (isProModel) {
      finalMaxTokens = Math.max(finalMaxTokens, 8192);
    } else if (isFlashModel) {
      finalMaxTokens = Math.max(finalMaxTokens, 4096);
    }
    
    console.log(`[TOKEN CONFIG] Model: ${selectedModel} | maxOutputTokens: ${finalMaxTokens}`);

    const chatSession = generativeModel.startChat({
      history: historyFromClient,
      generationConfig: {
        ...preset.generationConfig,
        maxOutputTokens: finalMaxTokens
      }
    });

    const latest = latestMessage.content.trim();
    const result = await chatSession.sendMessage(latest);

    const candidates = result.response?.candidates;
    if (candidates && candidates.length > 0) {
      const finishReason = candidates[0]?.finishReason;
      if (finishReason && finishReason !== 'STOP') {
        console.warn(`[${behaviour}] Response blocked. Reason: ${finishReason} | Model: ${selectedModel}`);
        
        if (finishReason === 'MAX_TOKENS') {
          const partialText = candidates[0]?.content?.parts?.[0]?.text;
          if (partialText) {
            console.log(`[MAX_TOKENS] Returning partial response (${partialText.length} chars)`);
            return res.json({ 
              reply: partialText + "\n\n[Response was truncated due to length. Please continue or ask a follow-up question.]",
              model: selectedModel 
            });
          } else {
            // No partial text available, return helpful message
            return res.json({ 
              reply: `The response exceeded the token limit for ${selectedModel}. Please try:\n- Using a shorter prompt\n- Switching to gemini-2.5-flash for better token efficiency\n- Breaking your question into smaller parts`,
              model: selectedModel 
            });
          }
        }
      }
    }

    const reply = result.response?.text?.() ?? "";

    if (!reply) {
      console.warn(`[${behaviour}] Empty reply received`);
      return res.json({ 
        reply: "I apologize, but I couldn't generate a response. This might be due to token limits. Please try a shorter message or reset the conversation." 
      });
    }

    console.log(`[CHAT SUCCESS] Model: ${selectedModel} | Response length: ${reply.length} chars`);
    res.json({ reply, model: selectedModel });
    }
  } catch (error) {
    console.error(`[CHAT ERROR] Model: ${selectedModel} | Error:`, error?.message ?? String(error));
    res.status(500).json({
      error: "Error - status-500",
      details: error?.message ?? String(error),
      model: selectedModel
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
