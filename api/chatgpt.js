import fetch from "node-fetch";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function askChatGPT(prompt) {
  const url = "https://api.openai.com/v1/chat/completions";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "⚠️ No response from ChatGPT";
}
