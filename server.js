import express from "express";
import dotevn from "dotenv";
import connectDB from "./db/db.js";
import ingestRoute from "./routes/ingest.js";
import aggregate from "./services/aggregator.js";

const app = express();
dotevn.config();
app.use(express.json());
app.use(express.static("public"));

const PORT = 8080 || process.env.PORT;

const startServer = async () => {
  try {
    await connectDB();

    app.use("/ingest", ingestRoute);

    app.get("/aggregate", async (req, res) => {
      const data = await aggregate(req.query);
      res.json(data);
    });

    app.listen(PORT, () => {
      console.log("Server started on port", PORT);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
