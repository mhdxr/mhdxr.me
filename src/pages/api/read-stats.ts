import { NextApiRequest, NextApiResponse } from 'next';

import { isFeatureEnabled } from '@/common/libs/env';
import { getALLTimeSinceToday, getReadStats } from '@/services/wakatime';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  if (!isFeatureEnabled.wakatime) {
    res.setHeader('Cache-Control', 'public, s-maxage=300');
    res.status(200).json({});
    return;
  }

  try {
    const [readStatsResponse, allTimeSinceTodayResponse] = await Promise.all([
      getReadStats(),
      getALLTimeSinceToday(),
    ]);

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=30',
    );

    res.status(200).json({
      ...readStatsResponse.data,
      all_time_since_today: allTimeSinceTodayResponse.data,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[api/read-stats] failed', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
