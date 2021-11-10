import { Flex, Heading, Stack, Grid, Image, Text } from '@chakra-ui/react';
import { SignInButton } from '../components/SignInButton';

export default function Home() {
  return (
    <Grid templateColumns={['1fr', '60% 1fr']} w="100vw" flexDir="column" h="100vh">
      <Flex w="100%" height="100%" flexDirection="column">
        <Heading
          color="pink.500"
          textAlign="center"
          width="100%"
          fontSize={['2rem', '3rem']}
          textShadow="0px 0px 5px #C4244D"
          marginTop={['4rem', '10rem']}
        >
          MINHAS METAS
        </Heading>
        <Flex alignSelf="center" marginTop="4rem">
          <Image src="/login.png" alt="Person selecting Goals" width={['227.5px', '455px']} />
        </Flex>
      </Flex>
      <Flex
        w="100%"
        alignItems="center"
        flexDir="column"
        height={['100%', '60%']}
        alignSelf="center"
        borderLeft="1px"
        borderTop={['1px', '0']}
        borderColor="gray.800"
      >
        <Flex
          width={['90%', '100%']}
          padding={['3rem 2rem', '3rem 2rem']}
          m="0 auto"
          flexDir="column"
        >
          <Heading fontSize={['1rem', '1.5rem']}>Seja bem vindo {';)'}</Heading>
          <Text fontSize="12" color="gray.500">
            Use sua conta do Google para acessar.
          </Text>
          <Flex
            width={['100%', '60%']}
            position="relative"
            alignSelf="center"
            marginTop={['2.5rem', '4rem']}
          >
            <SignInButton provider="Google" />
          </Flex>
        </Flex>
      </Flex>
    </Grid>
  );
}
