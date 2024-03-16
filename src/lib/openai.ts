import OpenAI from 'openai';

import { OPENAI_API_KEY } from '@config/api';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export function transcribe(file: File) {
  return openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
  });
}
