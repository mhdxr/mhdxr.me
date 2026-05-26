import { NextApiRequest, NextApiResponse } from 'next';

import { isFeatureEnabled } from '@/common/libs/env';
import { getNowPlaying } from '@/services/spotify';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // If Spotify isn't configured, respond gracefully. We return `null` (not an
  // object) to stay compatible with consumers that type the body as
  // `NowPlayingProps | null` (e.g. NowPlayingBar/Card/Card SWR usage).
  if (!isFeatureEnabled.spotify) {
    res.setHeader('Cache-Control', 'public, s-maxage=300');
    return res.status(200).json(null);
  }

  try {
    const response = await getNowPlaying();
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=30',
    );
    return res.status(200).json(response?.data ?? null);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[api/now-playing] failed', error);
    return res.status(200).json(null);
  }
}
