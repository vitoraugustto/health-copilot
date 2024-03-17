import { useState } from 'react';
import { ReactMic, ReactMicStopEvent } from 'react-mic';

import { Status } from '@common/types';
import { Box, Button, Input, Text } from '@components';
import { transcribe } from '@lib/openai';
import EditIcon from '@mui/icons-material/Edit';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import StopCircleIcon from '@mui/icons-material/StopCircle';
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
    width: '90px',
    height: '90px',
  };

  return (
    <Box hCenter gap="12px">
      <Text
        align="center"
        fontWeight="600"
        fontFamily="Titillium Web"
        fontSize="22px"
      >
        {isRecording && !audio && 'Clique no botão abaixo para encerrar'}
        {!isRecording &&
          !audio &&
          'Clique no botão abaixo para começar a gravar sua consulta'}
        {audio &&
          'Tudo pronto! Clique no botão abaixo para gerar seu prontuário com IA'}
      </Text>
      {!audio && (
        <IconButton onClick={() => setRecording((prevState) => !prevState)}>
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
      {audio && (
        <Button
          minWidth="220px"
          loading={status === 'pending'}
          fullWidth={false}
          text="Gerar prontuário"
          onClick={() => handleTranscribe(audio)}
          startIcon={status !== 'pending' && <SmartToyIcon />}
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
