import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { fauna } from '../../../services/fauna';
import { query as q } from 'faunadb';

type UserInfo = {
  data: {
    id: string;
  };
};

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_ID,
      authorizationUrl:
        'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
      scope:
        'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    }),
  ],
  callbacks: {
    async session(session) {
      const userInfo: UserInfo = await fauna.query(
        q.Get(q.Match(q.Index('users_by_email'), q.Casefold(session.user.email)))
      );
      return { ...session, id: userInfo.data.id };
    },
    async signIn(user, account, profile) {
      const { email, name, image, id } = user;
      try {
        await fauna.query(
          q.If(
            q.Not(q.Exists(q.Match(q.Index('users_by_email'), q.Casefold(email)))),
            q.Create(q.Collection('users'), {
              data: { email: email, name: name, image: image, id: id },
            }),
            q.Get(q.Match(q.Index('users_by_email'), q.Casefold(email)))
          )
        );
        return true;
      } catch (err) {
        return false;
      }
    },
  },
});
