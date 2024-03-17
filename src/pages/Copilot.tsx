import { useState } from 'react';
import { ReactMic, ReactMicStopEvent } from 'react-mic';

import { Status } from '@common/types';
import { Box, Button } from '@components';
import { transcribe } from '@lib/openai';
import { useTheme } from '@mui/material';

export const Copilot = () => {
  const theme = useTheme();

  const [isRecording, setRecording] = useState<boolean>(false);
  const [transcribedAudio, setTranscribedAudio] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  function handleTranscribe(e: ReactMicStopEvent) {
    setStatus('pending');
    const audio = e;

    transcribe(createFile(audio))
      .then((res) => {
        setStatus('succeeded');
        setTranscribedAudio(res.text);
      })
      .catch(() => setStatus('failed'));
  }

  return (
    <Box gap="14px" px="12px" hCenter vCenter minHeight="100vh">
      <ReactMic
        className="react-mic-styles"
        record={isRecording}
        onStop={handleTranscribe}
        strokeColor="white"
        mimeType="audio/webm"
        noiseSuppression
        visualSetting="frequencyBars"
        backgroundColor={theme.palette.primary.main}
      />
      <Box flexDirection="row" style={{ justifyContent: 'center' }}></Box>
      <Button
        minWidth="100px"
        loading={status === 'pending'}
        disabled={status === 'pending'}
        fullWidth={false}
        text={isRecording ? 'Pausar' : 'Gravar'}
        onClick={() => setRecording((prevState) => !prevState)}
      />
      <Box maxWidth="550px">
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
    </Box>
  );
};

function createFile(file: ReactMicStopEvent) {
  return new File([file.blob], 'audio_to_transcribe.webm', {
    type: file.options.mimeType,
  });
}
