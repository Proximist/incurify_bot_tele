import { handleCommand, handleCallback } from "../commands.js";
import { markUpdateProcessed } from "../db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("OK");
  }

  try {
    const update = req.body;
    const updateId = update?.update_id;

    if (typeof updateId === "number") {
      const isNewUpdate = await markUpdateProcessed(updateId);
      if (!isNewUpdate) {
        return res.status(200).send("OK");
      }
    }

    // Handle text messages
    if (update.message?.text) {
      await handleCommand(update.message);
    }

    // Handle callback queries (inline button clicks)
    if (update.callback_query) {
      await handleCallback(update.callback_query);
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error("Error handling update:", error);
    return res.status(200).send("OK");
  }
}
