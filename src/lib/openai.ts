import OpenAI from 'openai';

import { OPENAI_API_KEY, OPENAI_CONTEXT } from '@config/api';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export function transcribe(file: File) {
  return openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    prompt: 'Transcreva sempre para português.',
  });
}

export const chatCompletion = (prompt: string) => {
  return openai.chat.completions.create({
    messages: [
      { role: 'system', content: OPENAI_CONTEXT },
      { role: 'user', content: prompt },
    ],
    model: 'gpt-3.5-turbo',
  });
};
