import { NextApiRequest, NextApiResponse } from 'next';

import { isFeatureEnabled } from '@/common/libs/env';
import { getAvailableDevices } from '@/services/spotify';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!isFeatureEnabled.spotify) {
    res.setHeader('Cache-Control', 'public, s-maxage=300');
    return res.status(200).json([]);
  }

  try {
    const response = await getAvailableDevices();
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=30',
    );
    return res.status(200).json(response?.data ?? []);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[api/available-devices] failed', error);
    return res.status(200).json([]);
  }
}
