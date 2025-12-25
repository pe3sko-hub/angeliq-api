import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

// OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ROOT – test v prehliadači
app.get("/", (req, res) => {
  res.send("AngeliQ API is running ❤️");
});

// HEALTHCHECK – pre Railway
app.get("/healthz", (req, res) => {
  res.send("ok");
});

// INFO endpoint – aby GET /chat nepadal
app.get("/chat", (req, res) => {
  res.json({
    info: "Use POST /chat with JSON body { message: '...' }",
  });
});

// CHAT endpoint – HLAVNÁ FUNKCIA
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({
        error: "Missing 'message' in JSON body.",
      });
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: [
        {
          role: "system",
          content:
            "You are AngeliQ: playful, charming, flirty but classy, consensual, fun and emotionally intelligent. Keep responses short, warm, safe and positive. No explicit sexual content.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      text: response.output_text,
    });
  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({
      error: "Server error",
      details: String(err.message || err),
    });
  }
});

// PORT – Railway používa 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
