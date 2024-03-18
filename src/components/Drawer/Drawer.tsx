import { Link, useNavigate } from 'react-router-dom';

import { useConsultations } from '@hooks/useConsultations';
import AddIcon from '@mui/icons-material/Add';
import { Drawer as MUIDrawer } from '@mui/material';

import { Button } from '../UI/Button';

export function Drawer() {
  const navigate = useNavigate();
  const { createConsultation, consultations } = useConsultations();

  return (
    <MUIDrawer
      open
      anchor="left"
      variant="permanent"
      PaperProps={{ sx: { width: 240, p: '12px', gap: '12px' } }}
    >
      <Button
        startIcon={<AddIcon />}
        text="Nova consulta"
        onClick={() => {
          const consultationID = createConsultation();
          navigate(`/${consultationID}`);
        }}
      />
      {consultations.map((c, index) => (
        <Link to={`/${c.id}`}>
          <Button
            variant="outlined"
            text={c.title ?? `Consulta ${index + 1}`}
          />
        </Link>
      ))}
    </MUIDrawer>
  );
}
