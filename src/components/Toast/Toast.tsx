import { Alert, AlertProps, Snackbar, useTheme } from '@mui/material';

import { Text } from '../Text';

export const Toast: React.FC<{
  autoHideDuration?: number;
  open: boolean;
  onClose?: () => void;
  severity?: AlertProps['severity'];
  variant?: AlertProps['variant'];
  text: string;
}> = ({
  autoHideDuration = 5000,
  open,
  onClose,
  severity = 'info',
  variant = 'filled',
  text,
}) => {
  const theme = useTheme();

  return (
    <Snackbar
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      autoHideDuration={autoHideDuration}
      open={open}
      onClose={onClose}
    >
      <Alert
        style={{ alignItems: 'center' }}
        variant={variant}
        severity={severity}
      >
        <Text
          fontFamily="Titillium Web"
          color={
            variant === 'outlined' || variant === 'standard'
              ? theme.palette[severity].main
              : 'white'
          }
          fontSize="20px"
        >
          {text}
        </Text>
      </Alert>
    </Snackbar>
  );
};
