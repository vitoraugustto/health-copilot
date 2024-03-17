import {
  Route,
  BrowserRouter as Router,
  Routes as _Routes,
} from 'react-router-dom';

import { Copilot } from '@pages/Copilot';

export const Routes = () => {
  return (
    <Router>
      <_Routes>
        <Route path="/" element={<Copilot />} />
      </_Routes>
    </Router>
  );
};
