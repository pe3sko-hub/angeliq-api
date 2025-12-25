import express from "express";
import OpenAI from "openai";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// root
app.get("/", (req, res) => {
  res.send("AngeliQ API is running ❤️");
});

// health
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "angeliq-api",
    time: new Date().toISOString(),
  });
});

// chat
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
            "You are AngeliQ: playful, flirty, classy, consensual. Keep it fun and safe.",
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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
