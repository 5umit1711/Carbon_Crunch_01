import express from "express";
import normalize from "../services/normalizer.js";
import fingerprint from "../services/fingerprint.js";
import Event from "../model/event.js";
import { enqueuePending } from "../db/pendingQueue.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const simulateFailure = req.query.fail === "true";

  const normalized = normalize(req.body);
  const hash = fingerprint(normalized);

  try {
    if (simulateFailure) {
      throw new Error("Simulated failure");
    }

    await Event.updateOne(
      { fingerprint: hash },
      {
        $set: {
          fingerprint: hash,
          rawEvent: req.body,
          normalizedEvent: normalized,
          status: "SUCCESS",
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    res.json({ status: "OK", normalized });
  } catch (error) {
    try {
      await enqueuePending({ fingerprint: hash, rawEvent: req.body, normalizedEvent: normalized, status: "FAILED", error: error.message });
    } catch (qErr) {
      console.error("Failed to enqueue pending event:", qErr);
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;