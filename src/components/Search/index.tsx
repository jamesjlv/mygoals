import { Flex, Input, Text, Stack, Grid, Spinner, Icon } from '@chakra-ui/react';
import { IoSearchOutline } from 'react-icons/io5';
interface SearchProps {
  filter: (string) => void;
}

export function Search({ filter }: SearchProps) {
  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="4rem"
      align="center"
      justify="center"
      margin="1rem 0 0 auto"
    >
      <Flex width="80%" flexDirection="row" position="relative">
        <IoSearchOutline
          style={{
            position: 'absolute',
            color: 'gray.700',
            alignSelf: 'center',
            display: 'flex',
            zIndex: 99,
            left: '1rem',
          }}
        />
        <Input
          background="gray.800"
          borderColor="gray.700"
          placeholder="Buscar uma meta..."
          paddingLeft="3rem"
          onChange={(e) => filter(e.target.value)}
        />
      </Flex>
    </Flex>
  );
}
