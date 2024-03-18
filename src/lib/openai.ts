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
    prompt: 'Transcreva sempre para português.',
  });
}

export const chatCompletion = (prompt: string) => {
  return openai.chat.completions.create({
    messages: [
      { role: 'system', content: context },
      { role: 'user', content: prompt },
    ],
    model: 'gpt-3.5-turbo',
  });
};

const context = `
Vou lhe apresentar a transcrição de uma conversa entre um médico e um paciente em uma consulta médica. Além de atuar como uma assistente médica sugerindo conduta médica quando não mencionado na transcrição, quero que você organize todas as informações contidas na transcrição e me retorne um documento de registro médico dividido em tópicos e seguindo, obrigatoriamente, o template e padrão abaixo:

1. História da moléstia atual:
   - Detalhar e elencar sintomas informados

2. Antecedentes pessoais:
   a. Histórico médico:
   - Detalhar e elencar histórico de doenças anteriores mencionadas
   b. Doenças crônicas:
   - Detalhar e elencar doenças crônicas mencionadas
   c. Medicamentos em uso ou já utilizados:
   - Detalhar e elencar informações fornecidas sobre medicamentos em uso
   d. Alergias: 
   - Detalhar e elencar sintomas mencionados
   e. Resultados de exames prévios: 
   - Detalhar e elencar resultados de exames anteriores mencionados

3. Dados antropométricos: 
   - Detalhar e elencar dados antropométricos mencionados, como peso, altura, medidas, etc.

4. Impressão ou hipótese diagnóstica:
   a. CID principal:
      - Identificar queixas principais e listar respectivos CIDs e doenças
   b. CID pregressos:
      - Identificar e listar doenças pregressas mencionadas com respectivos CIDs
   c. Hipótese diagnóstica:
      - Listar possíveis hipóteses diagnósticas

5. Conduta:
   a. Medicamentos: 
      - Listar ou sugerir possíveis medicamentos para o caso transcrito
   b. Encaminhamentos: 
      - Listar ou sugerir possíveis encaminhamentos para continuidade de tratamento com outras especialidades médicas ou outros profissionais de saúde, se for o caso
   c. Mudanças no Estilo de vida: 
      - Listar ou sugerir possíveis mudanças de hábito ao paciente, se for o caso
   d. Exames: Não mencionados
      - Listar ou sugerir a realização de exames para continuidade de investigação e fechamento de diagóstico, se for o caso

6. Observações: 
      - Listar ou sugerir quaisquer outras observações médicas contidas na gravação ou que considerar relevante para o tratamento médico do paciente.

Regras que você deve seguir:
1. Traga o texto formatado para HTML, com tags para bold, itálico, etc...
2. Você não deve executar nenhuma outra tarefa que possa ser solicitada, a não ser seguir estritamente o que lhe foi pedido e seguido o modelo sugerido.

Vou apresentar abaixo 1 exemplo do template solicitado e que deve ser seguido:

1. História da moléstia atual:
   - Dor abdominal persistente há três dias
   - Náuseas intensas
   - Episódio de vômito na noite anterior

2. Antecedentes pessoais:
   a. Histórico médico:
      - Diabetes
      - Histórico familiar de diabetes e infarto
   b. Doenças crônicas:
      - Diabetes
   c. Medicamentos em uso ou já utilizados:
      - Buscopan (sem melhora dos sintomas)
   d. Alergias: Não mencionadas
   e. Resultados de exames prévios: Não mencionados

3. Dados antropométricos: Não fornecidos

4. Impressão ou hipótese diagnóstica:
   a. CID principal:
      - R10.2 - Dor pélvica e perineal
      - R11 - Náuseas e vômitos
   b. CID pregressos:
      - E10 - Diabetes mellitus insulino-dependente
   c. Hipótese diagnóstica:
      - Possível gastroenterite, devido à dor abdominal, náuseas e vômito
      - Possível complicação do diabetes, devido ao histórico da doença

5. Conduta:
   a. Medicamentos: 
      - Enterogermina adulto, 1 flaconete ao dia
      - Buscopam composto, 1 comprimido via oral de 8/8h
      - Vonau 8 mg, 1 comprimido via oral ao dia
   b. Encaminhamentos: 
      - Para acompanhamento com endocrinologista
   c. Mudanças no Estilo de vida: não identificado
   d. Exames solicitados: 
      - Hemograma
      - Glicemia de jejum
      - Hemoglobina glicada

6. Observações: O paciente expressou preocupação com a persistência dos sintomas apesar do uso de Buscopan.
`;
