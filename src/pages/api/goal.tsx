/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { Lambda, query as q } from 'faunadb';
import { fauna } from '../../services/fauna';
import { add, format } from 'date-fns';

type BodyProps = {
  quantity: string;
  description: string;
  category: string;
  ref: string;
  start_date?: string;
};

type CategoryReturn = {
  ref: {
    value: {
      id: string;
    };
  };
  data: { description: string; user_email: string };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const {
      quantity,
      description,
      category,
      ref,
      start_date: initialDate,
    }: BodyProps = JSON.parse(req.body);
    const session = await getSession({ req });

    if (!session) {
      res.setHeader('Allow', 'POST');
      res.status(405).end('Needs to be logged');
    }

    if (!ref) {
      try {
        const start_date = format(new Date(), 'yyyy,MM,dd');
        const daysadded = add(new Date(), { days: Number(quantity) });
        const end_date = new Date(daysadded).toLocaleDateString('ja-jp').split('/').join(',');

        const categoryResult = await fauna.query<CategoryReturn>(
          q.Map(
            q.Paginate(q.Match(q.Index('category_filter'), [session.user.email, category])),
            q.Lambda('X', q.Get(q.Var('X')))
          )
        );

        const { data, ref } = categoryResult;

        if (data[0]?.data?.description === category) {
          await fauna.query(
            q.Create(q.Collection('goals'), {
              data: {
                description: description,
                start_date,
                end_date,
                category: data[0].ref.value.id,
                user_email: session.user.email,
                report_type: 'auto_report',
                user_id: session.id,
              },
            })
          );
        } else {
          const categoryNew = await fauna.query<CategoryReturn>(
            q.Create(q.Collection('category_goals'), {
              data: {
                user_email: session.user.email,
                description: category,
              },
            })
          );

          await fauna.query(
            q.Create(q.Collection('goals'), {
              data: {
                description: description,
                start_date,
                end_date,
                category: categoryNew.ref.value.id,
                user_email: session.user.email,
                report_type: 'auto_report',
                user_id: session.id,
              },
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log({ quantity, description, category, ref });

      const daysadded = add(new Date(initialDate), { days: Number(quantity) });
      const end_date = new Date(daysadded).toLocaleDateString('ja-jp').split('/').join(',');

      const categoryResult = await fauna.query<CategoryReturn>(
        q.Map(
          q.Paginate(q.Match(q.Index('category_filter'), [session.user.email, category])),
          q.Lambda('X', q.Get(q.Var('X')))
        )
      );

      const { data, ref: refCategory } = categoryResult;

      if (data[0]?.data?.description === category) {
        await fauna.query(
          q.Update(q.Ref(q.Collection('goals'), ref), {
            data: { description: description, category: refCategory, end_date: end_date },
          })
        );
      } else {
        const categoryNew = await fauna.query<CategoryReturn>(
          q.Create(q.Collection('category_goals'), {
            data: {
              user_email: session.user.email,
              description: category,
            },
          })
        );
        await fauna.query(
          q.Update(q.Ref(q.Collection('goals'), ref), {
            data: {
              description: description,
              category: categoryNew.ref.value.id,
              end_date: end_date,
            },
          })
        );
      }
    }

    return res.status(200).json({ sessionId: session });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not Allowed');
  }
};
