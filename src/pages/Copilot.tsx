import { useState } from 'react';
import { ReactMic, ReactMicStopEvent } from 'react-mic';

import { Status } from '@common/types';
import { Box, Button, Input, Text } from '@components';
import { transcribe } from '@lib/openai';
import EditIcon from '@mui/icons-material/Edit';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { IconButton, MenuItem, TextField, useTheme } from '@mui/material';

export function Copilot() {
  const theme = useTheme();
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  return (
    <Box
      minHeight="100vh"
      backgroundColor={theme.palette.primary.light}
      p="12px"
    >
      <Box borderRadius="8px" gap="18px" backgroundColor="white" p="12px">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="Título da consulta"
          endAdornment={<EditIcon sx={{ color: theme.palette.primary.main }} />}
        />
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          label="Descrição da consulta"
          endAdornment={<EditIcon sx={{ color: theme.palette.primary.main }} />}
        />
        <TextField
          onChange={(e) => setType(e.target.value)}
          value={type ?? ''}
          select
          label="Tipo da consulta"
        >
          <MenuItem value="clinic">
            Consulta clínico geral (clínica médica)
          </MenuItem>
        </TextField>
        <TranscribeAudio />
      </Box>
    </Box>
  );
}

function TranscribeAudio() {
  const theme = useTheme();

  const [isRecording, setRecording] = useState<boolean>(false);
  const [transcribedAudio, setTranscribedAudio] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [audio, setAudio] = useState<ReactMicStopEvent>();

  function handleTranscribe(_audio: ReactMicStopEvent) {
    setStatus('pending');

    transcribe(createFile(_audio))
      .then((res) => {
        setStatus('succeeded');
        setTranscribedAudio(res.text);
      })
      .catch(() => setStatus('failed'));
  }

  const iconStyle = {
    color: theme.palette.primary.main,
    width: '72px',
    height: '72px',
  };

  return (
    <Box hCenter gap="12px">
      <Text fontWeight="600" fontFamily="Titillium Web" fontSize="22px">
        Clique no botão abaixo para começar a gravar sua consulta
      </Text>
      <IconButton
        style={{
          backgroundColor: '#fff',
          position: 'relative',
          zIndex: 2,
          top: '50px',
        }}
        onClick={() => setRecording((prevState) => !prevState)}
      >
        {isRecording ? (
          <PauseCircleIcon style={iconStyle} />
        ) : (
          <PlayCircleFilledIcon style={iconStyle} />
        )}
      </IconButton>
      <ReactMic
        record={isRecording}
        className="react-mic-styles"
        onStop={(e) => setAudio(e)}
        strokeColor={theme.palette.primary.main}
        mimeType="audio/webm"
        noiseSuppression
        visualSetting="frequencyBars"
      />
      {audio && (
        <Button
          fullWidth={false}
          text="Gerar prontuário"
          onClick={() => handleTranscribe(audio)}
          startIcon={<SmartToyIcon />}
        />
      )}
      {transcribedAudio && (
        <p style={{ fontSize: '14px', fontFamily: 'Titillium Web' }}>
          TRANSCRIÇÃO:&nbsp;
          <span
            style={{
              fontWeight: '600',
              fontSize: '20px',
              fontFamily: 'Titillium Web',
            }}
          >
            {transcribedAudio}
          </span>
        </p>
      )}
    </Box>
  );
}

function createFile(file: ReactMicStopEvent) {
  return new File([file.blob], 'audio_to_transcribe.webm', {
    type: file.options.mimeType,
  });
}
