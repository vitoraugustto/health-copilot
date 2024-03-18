import { Box } from '@components';
import { useTheme } from '@mui/material';

export function GettingStarted() {
  const theme = useTheme();

  return (
    <Box
      minHeight="100vh"
      backgroundColor={theme.palette.primary.light}
      p="12px"
    ></Box>
  );
}
