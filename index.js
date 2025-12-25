import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ROOT – test v prehliadači
app.get("/", (req, res) => {
  res.send("AngeliQ API is running ❤️");
});

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "angeliq-api",
    time: new Date().toISOString(),
  });
});

// CHAT ENDPOINT (POST ONLY)
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Missing 'message' in JSON body",
      });
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: [
        {
          role: "system",
          content:
            "You are AngeliQ: playful, flirty, classy, consensual. Be fun, light, and safe.",
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
    console.error(err);
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
