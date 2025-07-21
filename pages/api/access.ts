import { handleAccess } from "@/server/controllers/access";
import { Categories } from "@/server/models/interfaces";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    let { category, username_raw } = req.query;
    try {
      let cat: string = (category as string) || "";
      let username: string = (username_raw as string) || "";
      if (!category || !username) {
        return res.status(400).json({ error: "Invalid or missing parameter" });
      }
      if (!category) {
        return res
          .status(400)
          .json({ error: "Invalid or missing parameter", cat });
      }
      let user = await handleAccess(cat as Categories, username);
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
