import type { NextApiRequest, NextApiResponse } from 'next';

import { getBlogComment } from '@/services/devto';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ status: false, message: 'Method not allowed' });
    return;
  }

  const { post_id } = req.query;
  if (!post_id || Array.isArray(post_id)) {
    res.status(400).json({ status: false, message: 'Invalid post_id' });
    return;
  }

  try {
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=30',
    );

    const response = await getBlogComment({ post_id: String(post_id) });
    res.status(200).json({ status: true, data: response.data });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[api/comments] failed to load comments', error);
    res.status(500).json({ status: false, message: 'Failed to load comments' });
  }
}
