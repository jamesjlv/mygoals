import { Flex, Heading, Stack } from '@chakra-ui/react';
import { SignInButton } from '../components/SignInButton';

export default function Home() {
  return (
    <Flex w="100vw" flexDir="column" h="100vh">
      <Flex align="center" w="100%" marginTop="4.8rem">
        <Heading
          color="pink.500"
          textAlign="center"
          width="100%"
          fontSize="3rem"
          textShadow="0px 0px 5px #C4244D"
        >
          MINHAS METAS
        </Heading>
      </Flex>
      <Flex w="100%" alignItems="center" justifyContent="center" flexDir="column" height="100%">
        <Flex
          width="100%"
          maxWidth="30rem"
          bg="gray.800"
          padding="3rem 2rem"
          m="0 auto"
          flexDir="column"
          borderRadius="0.2rem"
        >
          <Heading alignSelf="center" fontSize="1.5rem" marginBottom="3.2rem">
            Acesse sua conta
          </Heading>
          <Stack spacing="4">
            <Flex width="100%" position="relative">
              <SignInButton provider="Google" />
            </Flex>
          </Stack>
        </Flex>
      </Flex>
    </Flex>
  );
}
