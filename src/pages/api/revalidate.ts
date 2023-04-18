import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  revalidated: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!process.env.REVALIDATE_SECRET) {
    return res.status(400).json({ revalidated: false });
  }

  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(400).json({ revalidated: false });
  }

  await res.revalidate("/");

  res.status(200).json({ revalidated: true });
}
