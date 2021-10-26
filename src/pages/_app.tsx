import type { AppProps } from 'next/app';
import { Provider as NextAuthProvider } from 'next-auth/client';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../styles/theme';
import { GoalsContextProvider } from '../contexts/GoalsContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <NextAuthProvider session={pageProps.session}>
        <GoalsContextProvider>
          <Component {...pageProps} />
        </GoalsContextProvider>
      </NextAuthProvider>
    </ChakraProvider>
  );
}
export default MyApp;
