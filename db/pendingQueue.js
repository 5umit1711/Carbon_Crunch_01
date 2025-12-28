import fs from "fs/promises";
import path from "path";
import Event from "../model/event.js";

const QUEUE_PATH = path.resolve("db", "pending_events.jsonl");

async function ensureQueueFile() {
  try {
    await fs.mkdir(path.dirname(QUEUE_PATH), { recursive: true });
    await fs.access(QUEUE_PATH).catch(() => fs.writeFile(QUEUE_PATH, ""));
  } catch (err) {
    console.error("Failed to ensure queue file:", err);
    throw err;
  }
}

export async function enqueuePending(event) {
  await ensureQueueFile();
  const line = JSON.stringify({ ts: new Date().toISOString(), event }) + "\n";
  await fs.appendFile(QUEUE_PATH, line, "utf8");
}

export async function flushPending() {
  await ensureQueueFile();
  const content = await fs.readFile(QUEUE_PATH, "utf8");
  if (!content.trim()) return;
  const lines = content.trim().split("\n");
  const leftovers = [];

  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      const e = parsed.event;
      await Event.updateOne(
        { fingerprint: e.fingerprint },
        {
          $set: {
            fingerprint: e.fingerprint,
            rawEvent: e.rawEvent,
            normalizedEvent: e.normalizedEvent,
            status: e.status === "FAILED" ? "FAILED" : "SUCCESS",
            updatedAt: new Date()
          },
          $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true }
      );
    } catch (err) {
      console.error("Failed to flush pending event, keeping it for retry:", err, line);
      leftovers.push(line);
    }
  }

  const newContent = leftovers.length ? leftovers.join("\n") + "\n" : "";
  await fs.writeFile(QUEUE_PATH, newContent, "utf8");
}