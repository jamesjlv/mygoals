import {
  InputProps as ChakraInputProps,
  Input as ChakraInput,
  FormLabel,
  FormErrorMessage,
  FormControl,
} from '@chakra-ui/react';
import React, { forwardRef, ForwardRefRenderFunction, ReactNode } from 'react';
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
    <FormControl isInvalid={!!error} marginTop={['.8rem', '1rem']} max-scale="1">
      {!!label && (
        <FormLabel htmlFor={name} color="gray.500" fontSize={['.8rem', '1rem']}>
          {label}
        </FormLabel>
      )}
      <ChakraInput
        name={name}
        id={name}
        bg="gray.700"
        variant=""
        autoFocus={false}
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
        size={'md'}
        {...register(name, { required: req })}
        {...rest}
        fontSize={['1rem', '1rem']}
      />
      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const Input = forwardRef(InputBase);
