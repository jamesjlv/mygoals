/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { query as q, Ref } from 'faunadb';
import { fauna } from '../../services/fauna';
import { add, format } from 'date-fns';

type BodyProps = {
  quantity: string;
  description: string;
  category: string;
};

type CategoryReturn = {
  ref: {
    value: {
      id: string;
    };
  };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { quantity, description, category }: BodyProps = JSON.parse(req.body);
    const session = await getSession({ req });

    try {
      const start_date = format(new Date(), 'yyyy,MM,dd');
      const daysadded = add(new Date(), { days: Number(quantity) });
      const end_date = new Date(daysadded).toLocaleDateString('ja-jp').split('/').join(',');

      const categoryReturn = await fauna.query<CategoryReturn>(
        q.ContainsValue(
          category,
          q.SelectAll(['data', 'description'], q.Collection('category_goals'))
        )
      );

      console.log(categoryReturn);

      // if (categoryReturn.ref.value.id) {
      //   fauna.query(
      //     q.Create(q.Collection('goals'), {
      //       data: {
      //         description: description,
      //         start_date,
      //         end_date,
      //         category: categoryReturn.ref.value.id,
      //         user_email: session.user.email,
      //         report_type: 'auto_report',
      //         user_id: session.id,
      //       },
      //     })
      //   );
      // }
    } catch (error) {
      console.log(error);
    }

    return res.status(200).json({ sessionId: session });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not Allowed');
  }
};
