import express from "express";

const app = express();
app.use(express.json());

// root
app.get("/", (req, res) => {
  res.send("AngeliQ API is running ❤️");
});

// health check (API test)
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "angeliq-api",
    time: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
