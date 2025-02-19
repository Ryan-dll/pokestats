// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(
      `https://pokedata.ovh/standings/tournaments.json`
    );
    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    return res.status(500);
  } finally {
    res.end();
  }
}
