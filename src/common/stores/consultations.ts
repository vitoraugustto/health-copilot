import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useConsultationsStore = create(
  persist<{
    consultations: IConsultation[];
    createConsultation: (id: IConsultation['id']) => void;
    updateConsultation: (
      id: IConsultation['id'],
      updateConsultation: IConsultation,
    ) => void;
  }>(
    (set) => ({
      consultations: [],
      createConsultation: (id) =>
        set((state) => ({ consultations: [...state.consultations, { id }] })),

      updateConsultation: (id, updatedConsultation) =>
        set((state) => ({
          consultations: state.consultations.map((consultation) =>
            consultation.id === id
              ? { ...consultation, ...updatedConsultation }
              : consultation,
          ),
        })),
    }),
    {
      name: 'consultation-storage',
    },
  ),
);

interface IConsultation {
  id?: string;
  title?: string;
  description?: string;
  anamnesis?: string;
}
