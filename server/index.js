const dotenv = require("dotenv");
dotenv.config();

 const express = require("express");
 const cors = require("cors");
 const connectDb = require("./config/db");
 const authRoutes = require("./routes/authRoutes");
 const notesRoutes = require("./routes/notesRoutes");
 const qaRoutes = require("./routes/qaRoutes");
 const exchangeRoutes = require("./routes/exchangeRoutes");
 const progressRoutes = require("./routes/progressRoutes");

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDb();
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

   app.use("/api/auth", authRoutes);
   app.use("/api/notes", notesRoutes);
   app.use("/api/qa", qaRoutes);
   app.use("/api/exchange", exchangeRoutes);
   app.use("/api/progress", progressRoutes);

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
