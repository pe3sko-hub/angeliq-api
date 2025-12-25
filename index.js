import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AngeliQ API is running ❤️");
});

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
