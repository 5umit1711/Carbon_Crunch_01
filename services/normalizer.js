function safeNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function parseTimestamp(value) {
  if (!value) return new Date();
  const d = new Date(value);
  if (isNaN(d.getTime())) {
    const alt = value.replace(/\//g, "-");
    const d2 = new Date(alt);
    if (!isNaN(d2.getTime())) return d2;
    return new Date();
  }
  return d;
}

export default function normalize(raw) {
  const payload = raw && raw.payload ? raw.payload : {};

  const timestamp = parseTimestamp(payload.timestamp);

  return {
    client_id: raw && raw.source ? String(raw.source) : "unknown",
    metric: payload && payload.metric ? String(payload.metric) : "unknown",
    amount: safeNumber(payload.amount, 0),
    timestamp: timestamp.toISOString()
  };
}