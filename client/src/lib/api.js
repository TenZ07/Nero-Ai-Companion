const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const defaultHeaders = {
  "Content-Type": "application/json",
};

export async function sendChat(messages, signal) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ messages }),
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



