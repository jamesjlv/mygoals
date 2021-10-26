import {
  InputProps as ChakraInputProps,
  Input as ChakraInput,
  FormLabel,
  FormErrorMessage,
  FormControl,
} from '@chakra-ui/react';
import { forwardRef, ForwardRefRenderFunction } from 'react';
import { FieldError } from 'react-hook-form';
interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  register?: Function;
  req?: string;
  error?: FieldError;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, register = () => {}, req, error = null, ...rest },
  ref
) => {
  return (
    <FormControl isInvalid={!!error} marginTop="1rem">
      {!!label && (
        <FormLabel htmlFor={name} color="gray.500">
          {label}
        </FormLabel>
      )}
      <ChakraInput
        name={name}
        id={name}
        bg="gray.700"
        variant=""
        _hover={{
          bg: 'gray.700',
        }}
        _focus={{
          bg: 'gray.700',
          border: '1.5px solid #AC2044',
        }}
        _placeholder={{
          color: 'gray.400',
        }}
        size="lg"
        {...register(name, { required: req })}
        {...rest}
      />
      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const Input = forwardRef(InputBase);
