import { handleAccess } from "@/server/controllers/access";
import { Categories } from "@/server/models/interfaces";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    let { category, username } = req.query;
    try {
      let cat: string = (category as string) || "";
      let user: string = (username as string) || "";
      if (!category || !user) {
        return res.status(400).json({ error: "Invalid or missing parameter" });
      }
      if (!category) {
        return res
          .status(400)
          .json({ error: "Invalid or missing parameter", cat });
      }
      let access_res = await handleAccess(cat as Categories, user);
      if (access_res.code === 200) {
        return res.status(200).json(access_res.message);
      } else {
        return res.status(access_res.code).json(access_res.message);
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
