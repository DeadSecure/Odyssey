import { handleRealDelay } from "@/server/controllers/realDelay";
import { PortManger } from "@/server/services/utils/ports";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    try {
      let list = PortManger.list();
      console.log(list);
      return res.status(200).json(list);
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Invalid or missing parameter", error_msg: error });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
