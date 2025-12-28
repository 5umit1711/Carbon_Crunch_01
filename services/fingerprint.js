import crypto from "crypto";

function stableStringify(obj) {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(stableStringify).join(',') + ']';
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => JSON.stringify(k) + ':' + stableStringify(obj[k])).join(',') + '}';
}

export default function fingerprint(normalizedEvent) {
  const base = {
    client_id: normalizedEvent.client_id,
    metric: normalizedEvent.metric,
    amount: normalizedEvent.amount,
    timestamp: normalizedEvent.timestamp
  };
  const stable = stableStringify(base);
  return crypto.createHash("sha256").update(stable).digest("hex");
}