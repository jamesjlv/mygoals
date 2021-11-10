import {
  Button as ChakraButton,
  Text,
  InputProps as ChakraInputProps,
  Spinner,
} from '@chakra-ui/react';

interface ButtonProps extends ChakraInputProps {
  description: string;
  color: string;
  width?: string;
  isLoading?: boolean;
  type?: string;
}

export function Button({
  description,
  color: bgColor,
  width = '13rem',
  isLoading = false,
  type = 'a',
}: ButtonProps) {
  return (
    <>
      <ChakraButton
        width={width}
        bg={bgColor}
        _hover={{ filter: 'brightness(1.2)' }}
        isLoading={isLoading}
        type="submit"
        _active={{ backgroundColor: 'none' }}
      >
        {isLoading ? (
          <Spinner />
        ) : type === 'a' ? (
          <a>
            <Text>{description}</Text>
          </a>
        ) : (
          <input
            type="submit"
            value={description}
            style={{ borderColor: 'none', background: 'none', width: '100%', height: '100%' }}
          />
        )}
      </ChakraButton>
    </>
  );
}
