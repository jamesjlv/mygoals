/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { fauna } from '../../services/fauna';
import { query as q } from 'faunadb';
type ReportData = {
  type: string;
  goal_ref: string;
  reportDate: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const { reportDate, type, goal_ref } = req.body;

  if (!session) {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Needs to be logged');
  }

  if (req.method === 'POST') {
    await fauna.query(
      q.Create(q.Collection('goals_reports'), {
        data: {
          type,
          goal_ref,
          reportDate,
          user_email: session.user.email,
        },
      })
    );

    res.status(200).end('ok');
  } else if (req.method === 'PUT') {
    console.log(req.body);
    res.status(200).end('ok');
  } else {
    res.setHeader('Allow', 'POST,PUT');
    res.status(405).end('Only Allowed if it is PUT or POST');
  }

  return;
};
