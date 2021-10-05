import { Flex, Text, Heading, Stack, Button } from '@chakra-ui/react';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '../components/Form/Input';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

type SignInFormData = {
  email: string;
  password: string;
};

const signInFormSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup.string().required('Senha obrigatória'),
});

export default function Home() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema),
  });

  const { errors } = formState;

  const handleSignIn: SubmitHandler<SignInFormData> = (values) => {
    console.log(values);
  };

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
          as="form"
          width="100%"
          maxWidth="30rem"
          bg="gray.800"
          padding="3rem 2rem"
          m="0 auto"
          flexDir="column"
          onSubmit={handleSubmit(handleSignIn)}
          borderRadius="0.2rem"
        >
          <Heading alignSelf="center" fontSize="1.5rem" marginBottom="3.2rem">
            Entrar
          </Heading>
          <Stack spacing={4}>
            <Input
              type="email"
              name="email"
              label="E-mail"
              register={register}
              error={errors.email}
              placeholder="Digite seu email"
            />
            <Input
              type="password"
              name="password"
              label="Senha"
              register={register}
              error={errors.password}
              placeholder="Digite sua senha"
            />
          </Stack>
          <Button
            mt="1.6rem"
            type="submit"
            colorScheme="pink"
            size="lg"
            isLoading={formState.isSubmitting}
          >
            Entrar
          </Button>
          <Link href="/">
            <a>
              <Text width="100%" textAlign="center" marginTop="1.6rem" textDecoration="underline">
                Registre-se
              </Text>
            </a>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
}
