import { ReactNode } from 'react';

import { useTheme } from '@mui/material';

import { Box } from '../Box';

export function Background({ children }: { children: ReactNode }) {
  const theme = useTheme();

  return (
    <Box
      minHeight="100vh"
      backgroundColor={theme.palette.primary.light}
      p="12px"
    >
      <Box borderRadius="8px" gap="18px" backgroundColor="white" p="12px">
        {children}
      </Box>
    </Box>
  );
}
