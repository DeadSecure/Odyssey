import { handleConfigs } from "@/server/controllers/config";
import { handleCore } from "@/server/controllers/core";
import { ConfigReq } from "@/server/models/interfaces";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    let { username } = req.body as { username: string };

    try {
      let name: string = username;
      if (!name) {
        return res
          .status(400)
          .json({ error: "Invalid or missing parameter", name });
      }
      let user = await handleCore(name);
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
