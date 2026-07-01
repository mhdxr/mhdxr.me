import { NextApiRequest, NextApiResponse } from 'next';

import { postChatPrompt } from '@/services/chatgpt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await postChatPrompt(prompt.trim());

    if (response?.status >= 400) {
      return res.status(response?.status).json({ error: response?.message });
    }

    const reply = response?.data?.choices[0]?.text;
    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to process chat prompt' });
  }
}
