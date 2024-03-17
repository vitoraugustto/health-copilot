import { TextField } from '@mui/material';

import { IInput } from './Input.types';

export const Input: React.FC<IInput> = ({
  multiline,
  autoFocus,
  fullWidth,
  placeholder,
  label,
  maxLength,
  value,
  onFocus,
  onChange,
  shouldFocus,
  endAdornment,
  startAdornment,
  error,
  hiddenLabel,
  helperText,
  variant,
  minRows,
  maxRows,
  style,
}) => {
  return (
    <TextField
      InputProps={{
        endAdornment,
        startAdornment,
        style,
      }}
      hiddenLabel={hiddenLabel}
      helperText={helperText}
      multiline={multiline}
      inputRef={(input) => shouldFocus && input && input.focus()}
      autoFocus={autoFocus}
      inputProps={{ maxLength: maxLength }}
      placeholder={placeholder}
      fullWidth={fullWidth}
      label={label}
      value={value}
      error={error}
      onFocus={onFocus}
      onChange={onChange}
      variant={variant}
      margin="normal"
      minRows={minRows}
      maxRows={maxRows}
      style={{ margin: 0 }}
    />
  );
};
