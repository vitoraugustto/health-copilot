import { Fragment } from 'react/jsx-runtime';

import { Box, Button } from '@components';
import AddIcon from '@mui/icons-material/Add';
import { Drawer } from '@mui/material';

import './App.css';
import { Routes } from './routes';

export function App() {
  return (
    <Fragment>
      <Drawer
        open
        anchor="left"
        variant="permanent"
        PaperProps={{ sx: { width: 240, p: '12px' } }}
      >
        <Button startIcon={<AddIcon />} text="Nova consulta" />
      </Drawer>
      <Box width={`calc(100% - ${240}px)`} ml={`${240}px`}>
        <Routes />
      </Box>
    </Fragment>
  );
}
