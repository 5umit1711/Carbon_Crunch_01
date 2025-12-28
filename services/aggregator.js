import Event from "../model/event.js";

const aggregate = async (filters) => {
  const match = { status: "SUCCESS" };

  if (filters.client) {
    match["normalizedEvent.client_id"] = filters.client;
  }

  if (filters.from || filters.to) {
    match["normalizedEvent.timestamp"] = {};
    if (filters.from)
      match["normalizedEvent.timestamp"].$gte = new Date(filters.from);
    if (filters.to)
      match["normalizedEvent.timestamp"].$lte = new Date(filters.to);
  }

  return Event.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$normalizedEvent.client_id",
        count: { $sum: 1 },
        totalAmount: { $sum: "$normalizedEvent.amount" }
      }
    }
  ]);
};

export default aggregate;
