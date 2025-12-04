const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

const defaultHeaders = {
  "Content-Type": "application/json",
};

export async function sendChat(messages, behaviour = "explainer", model = "gemini-1.5-pro", signal) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ messages, behaviour, model }),
    signal,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody?.error || response.statusText;
    throw new Error(message);
  }

  return response.json();
}

export function getHealth() {
  return fetch(`${API_BASE_URL}/health`).then((res) => res.json());
}
