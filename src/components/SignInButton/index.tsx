import { Button, Spinner, Flex } from '@chakra-ui/react';
import { signIn } from 'next-auth/client';
import { useSession, signOut } from 'next-auth/client';
import { useRouter } from 'next/router';
import { FcGoogle } from 'react-icons/fc';

interface SignInButtonProps {
  provider: string;
}

export function SignInButton({ provider }: SignInButtonProps) {
  const [session, loading] = useSession();

  const router = useRouter();

  if (session?.user.email) {
    router.push('/dashboard');
  }

  async function handleSubscription() {
    signIn(provider.toLowerCase());
  }

  return (
    <Button
      bg="gray.800"
      _hover={{
        background: 'gray.800',
        filter: 'brightness(0.9)',
        transition: 'filter .2s ease-in-out',
      }}
      _active={{ backgroundColor: 'none' }}
      onClick={handleSubscription}
      width="100%"
    >
      {loading || session?.user ? (
        <Spinner />
      ) : (
        <Flex fontSize={['.8rem', '.9rem']}>
          {provider === 'Google' && <FcGoogle style={{ marginRight: '1rem' }} />}
          <a>Acesse com {provider}</a>
        </Flex>
      )}
    </Button>
  );
}
