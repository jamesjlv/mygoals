import {
  SelectProps as ChakraSelectProps,
  Select as ChakraSelect,
  FormLabel,
  FormErrorMessage,
  FormControl,
} from '@chakra-ui/react';
import React, { forwardRef, ForwardRefRenderFunction, ReactNode } from 'react';
import { FieldError } from 'react-hook-form';
interface InputProps extends ChakraSelectProps {
  name: string;
  label?: string;
  register?: Function;
  req?: string;
  error?: FieldError;
  children: ReactNode;
}

const SelectBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, register = () => {}, req, error = null, children, ...rest },
  ref
) => {
  return (
    <FormControl isInvalid={!!error} marginTop={['.8rem', '1rem']}>
      {!!label && (
        <FormLabel htmlFor={name} color="gray.500" fontSize={['.8rem', '1rem']}>
          {label}
        </FormLabel>
      )}
      <ChakraSelect
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
        size={'md'}
        {...register(name, { required: req })}
        {...rest}
        fontSize={['.9rem', '1rem']}
      >
        {children}
      </ChakraSelect>
      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const Select = forwardRef(SelectBase);
