import { NextApiRequest, NextApiResponse } from 'next';

import { isFeatureEnabled } from '@/common/libs/env';
import { getGithubUser } from '@/services/github';

const ALLOWED_TYPES = new Set(['personal', 'work']);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const rawType = Array.isArray(req.query.type)
    ? req.query.type[0]
    : req.query.type;
  const type = typeof rawType === 'string' ? rawType : '';

  if (type && !ALLOWED_TYPES.has(type)) {
    return res.status(400).json({ message: 'Invalid type' });
  }

  // If no GitHub token is configured, short-circuit with an empty payload.
  // Returning `{}` (not throwing or hitting the API) keeps the existing
  // SWR consumers (`Contributions.tsx`) happy — they read
  // `data?.contributionsCollection?.contributionCalendar` with optional
  // chaining and render an empty state when undefined.
  if (!isFeatureEnabled.github) {
    res.setHeader('Cache-Control', 'public, s-maxage=300');
    return res.status(200).json({});
  }

  try {
    const response = await getGithubUser(type);

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=30',
    );

    const status = Number(response?.status) || 500;
    return res.status(status).json(response?.data ?? {});
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[api/github] failed', error);
    return res.status(500).json({ message: 'Failed to load GitHub data' });
  }
}
