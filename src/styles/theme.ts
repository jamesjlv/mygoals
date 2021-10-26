import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    gray: {
      400: '#5B5F61',
      500: '#53575A',
      700: '#353739',
      800: '#202327',
      900: '#1B1D1F',
    },
    pink: {
      600: '#AC2044',
      500: '#C4244D',
    },
    green: {
      500: '#00942B',
    },
    white: '#E5E5E5',
  },
  fonts: {
    body: 'Sora, sans-serif',
    heading: 'Sora, sans-serif',
  },

  styles: {
    global: {
      'html, body': {
        bg: 'gray.900',
        color: 'white',
      },
    },
  },
});
