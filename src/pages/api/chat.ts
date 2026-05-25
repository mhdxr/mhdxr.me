import { NextApiRequest, NextApiResponse } from 'next';

import { postChatPrompt } from '@/services/chatgpt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    // Input validation
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid prompt' });
    }

    if (prompt.length > 500) {
      return res
        .status(400)
        .json({ error: 'Prompt too long (max 500 characters)' });
    }

    const response = await postChatPrompt(prompt);

    if (response?.status >= 400) {
      res.status(response?.status).json({ error: response?.message });
    } else {
      // Updated to use new chat completions response format
      const reply = response?.data?.choices[0]?.message?.content;
      res.status(200).json({ reply });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
