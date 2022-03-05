import { getCases } from "../../services/cases";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { date = "" } = req.query;
  return res.status(200).json(typeof date === "string" ? await getCases(date) : await getCases());
}
