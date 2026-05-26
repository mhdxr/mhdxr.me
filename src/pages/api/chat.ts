import { NextApiRequest, NextApiResponse } from 'next';

import { isFeatureEnabled } from '@/common/libs/env';
import { postChatPrompt } from '@/services/chatgpt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isFeatureEnabled.openai) {
    return res.status(503).json({ error: 'Chat feature is not configured' });
  }

  try {
    const { prompt } = (req.body ?? {}) as { prompt?: unknown };

    if (typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Invalid prompt' });
    }

    if (prompt.length > 500) {
      return res
        .status(400)
        .json({ error: 'Prompt too long (max 500 characters)' });
    }

    const response = await postChatPrompt(prompt);

    if (response?.status >= 400) {
      return res
        .status(Number(response?.status) || 502)
        .json({ error: response?.message ?? 'Upstream error' });
    }

    const reply = response?.data?.choices?.[0]?.message?.content ?? '';
    return res.status(200).json({ reply });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[api/chat] failed', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
