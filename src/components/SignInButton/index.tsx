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
      bg="gray.700"
      _hover={{
        background: 'gray.700',
        filter: 'brightness(0.9)',
        transition: 'filter .2s ease-in-out',
      }}
      onClick={handleSubscription}
      width="100%"
    >
      {loading || session?.user ? (
        <Spinner />
      ) : (
        <Flex>
          {provider === 'Google' && <FcGoogle style={{ marginRight: '1rem' }} />}
          <a>Acesse com {provider}</a>
        </Flex>
      )}
    </Button>
  );
}