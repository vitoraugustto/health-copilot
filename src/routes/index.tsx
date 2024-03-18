import {
  Route,
  BrowserRouter as Router,
  Routes as _Routes,
} from 'react-router-dom';

import { Box, Drawer } from '@components';
import { Copilot } from '@pages/Copilot';
import { GettingStarted } from '@pages/GettingStarted';

export const Routes = () => {
  return (
    <Router>
      <Drawer />
      <Box width={`calc(100% - ${240}px)`} ml={`${240}px`}>
        <_Routes>
          <Route path="/" element={<GettingStarted />} />
          <Route path="/:consultationID" element={<Copilot />} />
        </_Routes>
      </Box>
    </Router>
  );
};
