import { Color } from '@common/types';
import { SxProps } from '@mui/material';

// TODO: backgroundColor should be 'Color' instead of 'Color | string'. But I could not override 'PaletteColor.main' to type 'Color'.

export interface IButton {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: 'text' | 'contained' | 'outlined';
  disabled?: boolean;
  borderRadius?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  fullWidth?: boolean;
  text: string;
  backgroundColor?: Color | string;
  color?: Color;
  loading?: boolean;
  style?: SxProps;
  onClick?: () => void;
}
