/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Needs to be logged');
  }

  if (req.method === 'POST') {
    console.log(req.body);
  } else if (req.method === 'PUT') {
    console.log(req.body);
  } else {
    res.setHeader('Allow', 'POST,PUT');
    res.status(405).end('Only Allowed if it is PUT or POST');
  }

  return;
};
