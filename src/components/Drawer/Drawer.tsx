import AddIcon from '@mui/icons-material/Add';
import { Drawer as MUIDrawer } from '@mui/material';

import { Button } from '../UI/Button';

export function Drawer() {
  return (
    <MUIDrawer
      open
      anchor="left"
      variant="permanent"
      PaperProps={{ sx: { width: 240, p: '12px', gap: '12px' } }}
    >
      <Button startIcon={<AddIcon />} text="Nova consulta" />
    </MUIDrawer>
  );
}
