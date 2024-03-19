import copy from 'copy-to-clipboard';
import { useEffect, useState } from 'react';
import { ReactMic, ReactMicStopEvent } from 'react-mic';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useParams } from 'react-router-dom';

import { useConsultationsStore } from '@common/stores/consultations';
import { Status } from '@common/types';
import { Background, Box, Button, Input, Text, Toast } from '@components';
import { chatCompletion, transcribe } from '@lib/openai';
import EditIcon from '@mui/icons-material/Edit';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import {
  CircularProgress,
  IconButton,
  MenuItem,
  TextField,
  useTheme,
} from '@mui/material';

export function Copilot() {
  const theme = useTheme();
  const { consultations, updateConsultation } = useConsultationsStore();
  const params = useParams() as { consultationID: string };

  const [currentConsultation, setCurrentConsultation] = useState(
    consultations.find(
      (consultation) => consultation.id === params.consultationID,
    ),
  );
  const [type, setType] = useState(currentConsultation?.type ?? '');
  const [title, setTitle] = useState(currentConsultation?.title ?? '');
  const [description, setDescription] = useState(
    currentConsultation?.description ?? '',
  );
  const [transcribedAudio, setTranscribedAudio] = useState('');
  const [anamnesis, setAnamnesis] = useState(
    currentConsultation?.anamnesis ?? '',
  );
  const [status, setStatus] = useState<Status>('idle');
  const [audio, setAudio] = useState<ReactMicStopEvent>();

  const [showToast, setShowToast] = useState(false);

  const getCurrentConsultation = () => {
    setAudio(undefined);
    setTranscribedAudio('');
    setCurrentConsultation(
      consultations.find(
        (consultation) => consultation.id === params.consultationID,
      ),
    );
  };

  useEffect(() => {
    getCurrentConsultation();
  }, [params.consultationID]);

  useEffect(() => {
    if (currentConsultation) {
      setTitle(currentConsultation.title ?? '');
      setDescription(currentConsultation.description ?? '');
      setAnamnesis(currentConsultation.anamnesis ?? '');
      setType(currentConsultation.type ?? '');
    }
  }, [currentConsultation]);

  return (
    <Background>
      <Input
        value={title}
        onChange={(e) => {
          updateConsultation(params.consultationID, { title: e.target.value });
          setTitle(e.target.value);
        }}
        label="Título da consulta"
        endAdornment={<EditIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Input
        value={description}
        onChange={(e) => {
          updateConsultation(params.consultationID, {
            description: e.target.value,
          });
          setDescription(e.target.value);
        }}
        label="Descrição da consulta"
        endAdornment={<EditIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <TextField
        onChange={(e) => {
          setType(e.target.value);
          updateConsultation(params.consultationID, {
            type: e.target.value,
          });
        }}
        value={type}
        select
        label="Tipo da consulta"
      >
        <MenuItem value="clinic">
          Consulta Clínico Geral (Clínica Médica)
        </MenuItem>
        <MenuItem value="dermatology">
          Consulta Dermatologia (Cuidados com a Pele)
        </MenuItem>
        <MenuItem value="ortopedia">
          Consulta Ortopedia (Tratamento de Lesões e Doenças
          Musculoesqueléticas)
        </MenuItem>
        <MenuItem value="cardiologia">
          Consulta Cardiologia (Saúde do Coração e Circulação)
        </MenuItem>
        <MenuItem value="oftalmologia">
          Consulta Oftalmologia (Cuidados com os Olhos e Visão)
        </MenuItem>
        <MenuItem value="pediatria">
          Consulta Pediatria (Cuidados Médicos Especializados para Crianças)
        </MenuItem>
      </TextField>
      {currentConsultation?.anamnesis === '' &&
        anamnesis === '' &&
        transcribedAudio &&
        transcribedAudio !== '' &&
        audio && (
          <GenerateAnamnesis
            status={status}
            transcribedAudio={transcribedAudio}
            setStatus={setStatus}
            setAnamnesis={setAnamnesis}
            getCurrentConsultation={getCurrentConsultation}
          />
        )}
      {(currentConsultation?.anamnesis === '' || anamnesis === '') &&
        transcribedAudio === '' && (
          <TranscribeAudio
            audio={audio}
            setAudio={setAudio}
            setStatus={setStatus}
            setTranscribedAudio={setTranscribedAudio}
          />
        )}
      {(currentConsultation?.anamnesis || anamnesis) && (
        <Box gap="12px">
          <Button
            onClick={() => {
              copy(anamnesis, { format: 'text/html' });

              setShowToast(true);
            }}
            variant="outlined"
            style={{ alignSelf: 'flex-end' }}
            fullWidth={false}
            text="Copiar texto"
          />
          <Box flexDirection="column">
            <ReactQuill
              theme="snow"
              value={anamnesis}
              onChange={(value) => {
                updateConsultation(params.consultationID, {
                  anamnesis: value,
                });
                setAnamnesis(value);
              }}
            />
          </Box>
        </Box>
      )}
      <Toast
        text="Copiado com sucesso!"
        severity="success"
        open={showToast}
        onClose={() => setShowToast(false)}
      />
    </Background>
  );
}

function GenerateAnamnesis({
  status,
  transcribedAudio,
  setStatus,
  setAnamnesis,
}: {
  status: Status;
  transcribedAudio: string;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
  setAnamnesis: React.Dispatch<React.SetStateAction<string>>;
  getCurrentConsultation: () => void;
}) {
  const { updateConsultation } = useConsultationsStore();
  const params = useParams() as { consultationID: string };

  function generateAnamnesis() {
    setStatus('pending');
    chatCompletion(transcribedAudio)
      .then((res) => {
        setStatus('succeeded');
        setAnamnesis(res.choices[0].message.content ?? '');
        updateConsultation(params.consultationID, {
          anamnesis: res.choices[0].message.content ?? '',
        });
      })
      .catch(() => setStatus('failed'));
  }

  return (
    <Box hCenter gap="12px">
      <Text
        align="center"
        fontWeight="600"
        fontFamily="Titillium Web"
        fontSize="22px"
      >
        Clique no botão abaixo para gerar seu prontuário com IA
      </Text>
      <Button
        onClick={generateAnamnesis}
        minWidth="220px"
        loading={status === 'pending'}
        disabled={status === 'pending'}
        fullWidth={false}
        text="Gerar prontuário"
        startIcon={status !== 'pending' && <SmartToyIcon />}
      />
    </Box>
  );
}

function TranscribeAudio({
  audio,
  setAudio,
  setTranscribedAudio,
}: {
  audio?: ReactMicStopEvent;
  setAudio: React.Dispatch<React.SetStateAction<ReactMicStopEvent | undefined>>;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
  setTranscribedAudio: React.Dispatch<React.SetStateAction<string>>;
}) {
  const theme = useTheme();

  const [transcribeStatus, setTranscribeStatus] = useState<Status>('idle');
  const [isRecording, setRecording] = useState<boolean>(false);

  const iconStyle = {
    color: theme.palette.primary.main,
    width: '90px',
    height: '90px',
  };

  function handleTranscribe() {
    if (audio) {
      setTranscribeStatus('pending');

      transcribe(createFile(audio)).then((res) => {
        setTranscribeStatus('succeeded');
        setTranscribedAudio(res.text);
      });
    }
  }

  useEffect(() => {
    handleTranscribe();
  }, [audio]);

  if (transcribeStatus === 'pending') {
    return (
      <Box hCenter gap="28px">
        <Box hCenter vCenter>
          <Text
            fontWeight="600"
            color="teal"
            fontFamily="Titillium Web"
            fontSize="28px"
          >
            Processando áudio
          </Text>
          <Text fontFamily="Titillium Web">
            Isso pode levar alguns segundos...
          </Text>
        </Box>
        <CircularProgress thickness={4.5} size={50} />
      </Box>
    );
  }

  return (
    <Box hCenter gap="12px">
      <Text
        align="center"
        fontWeight="600"
        fontFamily="Titillium Web"
        fontSize="22px"
      >
        {isRecording
          ? 'Clique no botão abaixo para encerrar'
          : 'Clique no botão abaixo para começar a gravar sua consulta'}
      </Text>
      {!audio && (
        <IconButton
          onClick={() => {
            if (!isRecording) {
              setRecording(true);
            } else {
              setRecording(false);
            }
          }}
        >
          {isRecording ? (
            <StopCircleIcon style={iconStyle} />
          ) : (
            <PlayCircleFilledIcon style={iconStyle} />
          )}
        </IconButton>
      )}
      {!audio && (
        <ReactMic
          record={isRecording}
          className={isRecording ? 'react-mic-styles' : 'react-mic-styles-none'}
          onStop={(e) => setAudio(e)}
          strokeColor={theme.palette.primary.main}
          mimeType="audio/webm"
          noiseSuppression
          visualSetting="frequencyBars"
        />
      )}
    </Box>
  );
}

function createFile(file: ReactMicStopEvent) {
  return new File([file.blob], 'audio_to_transcribe.webm', {
    type: file.options.mimeType,
  });
}
