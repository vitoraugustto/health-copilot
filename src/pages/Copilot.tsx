import { useEffect, useState } from 'react';
import { ReactMic, ReactMicStopEvent } from 'react-mic';
import { useParams } from 'react-router-dom';

import { useConsultationsStore } from '@common/stores/consultations';
import { Status } from '@common/types';
import { Background, Box, Button, Input, Text } from '@components';
import { chatCompletion, transcribe } from '@lib/openai';
import EditIcon from '@mui/icons-material/Edit';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { IconButton, MenuItem, TextField, useTheme } from '@mui/material';

export function Copilot() {
  const theme = useTheme();
  const { consultations, updateConsultation } = useConsultationsStore();
  const params = useParams() as { consultationID: string };

  const [currentConsultation, setCurrentConsultation] = useState(
    consultations.find(
      (consultation) => consultation.id === params.consultationID,
    ),
  );
  // const [type, setType] = useState('');
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
    }
  }, [currentConsultation]);

  console.log(anamnesis === '');

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
        // onChange={(e) => setType(e.target.value)}
        value="clinic"
        select
        disabled
        label="Tipo da consulta"
      >
        <MenuItem value="clinic">
          Consulta clínico geral (clínica médica)
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
            onClick={() => navigator.clipboard.writeText(anamnesis)}
            variant="outlined"
            style={{ alignSelf: 'flex-end' }}
            fullWidth={false}
            text="Copiar texto"
          />
          <Input
            fullWidth
            multiline
            minRows="16"
            value={anamnesis}
            onChange={(e) => {
              updateConsultation(params.consultationID, {
                anamnesis: e.target.value,
              });
              setAnamnesis(e.target.value);
            }}
          />
        </Box>
      )}
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

  const [isRecording, setRecording] = useState<boolean>(false);

  const iconStyle = {
    color: theme.palette.primary.main,
    width: '90px',
    height: '90px',
  };

  function handleTranscribe() {
    if (audio) {
      transcribe(createFile(audio)).then((res) => {
        setTranscribedAudio(res.text);
      });
    }
  }

  useEffect(() => {
    handleTranscribe();
  }, [audio]);

  console.log(audio);

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
