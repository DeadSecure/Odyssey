import { handleRealDelay } from "@/server/controllers/realDelay";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    let { username } = req.query;
    let username_parse: string = username as string;
    if (!username) {
      return res
        .status(400)
        .json({ error: "Invalid or missing parameter", username });
    }

    try {
      let user = await handleRealDelay(username_parse);
      if (user.code === 200) {
        return res.status(200).json(user.message);
      } else {
        return res.status(user.code).json(user.message);
      }
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Invalid or missing parameter", error_msg: error });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
