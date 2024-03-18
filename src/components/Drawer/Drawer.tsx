import { useNavigate } from 'react-router-dom';

import { useConsultationsStore } from '@common/stores/consultations';
import AddIcon from '@mui/icons-material/Add';
import { Drawer as MUIDrawer } from '@mui/material';

import { Button } from '../UI/Button';

export function Drawer() {
  const navigate = useNavigate();
  const { consultations, createConsultation } = useConsultationsStore();
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
          const id = crypto.randomUUID();

          createConsultation(id);
          navigate(`/${id}`);
        }}
      />
      {consultations.map((consultation, index) => (
        <Button
          variant="outlined"
          key={consultation.id}
          text={
            consultation.title !== ''
              ? consultation.title ?? ''
              : `Consulta ${index + 1}`
          }
          onClick={() => {
            navigate(`/${consultation.id}`);
          }}
        />
      ))}
    </MUIDrawer>
  );
}
