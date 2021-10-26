import Router from 'next/router';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { fauna } from '../services/fauna';
import { query as q } from 'faunadb';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { compare } from 'bcryptjs';

type FaunaInterfaceResponse = {
  ref: string;
  ts: number;
  data: {
    uuid: string;
    email: string;
    password: string;
    name: string;
  };
};

interface AuthProviderProps {
  children: ReactNode;
}

type User = {
  email: string;
  uuid: string;
  name: string;
};

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<any>;
  signOut: () => void;
  user: User;
  isAuthenticated: boolean;
};

let authChannel: BroadcastChannel;

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  destroyCookie(undefined, 'mygoalsauth.uuid');

  authChannel.postMessage('signOut');

  Router.push('/');
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel('auth');
    authChannel.onmessage = (message) => {
      switch (message.data) {
        case 'signOut':
          signOut();
          authChannel.close();
          break;
        case 'signIn':
          Router.push('/dashboard');
          break;
        default:
          break;
      }
    };
  }, []);

  async function passwordVerified(password: string, passwordCompare: string) {
    const passwordIsValid = await compare(password, passwordCompare);
    return passwordIsValid;
  }

  async function userHasToken(email: string, token = null) {
    try {
      const response = await fauna.query(q.Get(q.Match(q.Index('auth_by_email'), email)));
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function signIn({ email, password }: SignInCredentials) {
    try {
      console.log(process.env.FAUNADB_KEY);
      const response = await fauna.query<FaunaInterfaceResponse>(
        q.Get(q.Match(q.Index('users_by_email'), q.Casefold(email)))
      );
      const { uuid, name, password: passwordDb } = response.data;
      const passwordIsVerified = await passwordVerified(password, passwordDb);

      if (!passwordIsVerified) {
        console.log('Senha incorreta');
        return 'Error';
      }

      await userHasToken(email);

      const signInUser = {
        email,
        uuid,
        name,
      };

      // setCookie(undefined, 'mygoals.token', );

      setUser(signInUser);
      // Router.push('/dashboard');
      // authChannel.postMessage('signIn');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
