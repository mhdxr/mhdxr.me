import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

interface ResponseData {
  views: number;
}

const SLUG_PATTERN = /^[a-zA-Z0-9_\-/.]{1,200}$/;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { slug } = req.query;

  if (
    !slug ||
    Array.isArray(slug) ||
    typeof slug !== 'string' ||
    !SLUG_PATTERN.test(slug)
  ) {
    return res.status(400).json({ error: 'Invalid slug' });
  }

  if (req.method === 'GET') {
    try {
      const contentMeta = await prisma.contentmeta.findUnique({
        where: { slug },
        select: { views: true },
      });

      const response: ResponseData = { views: contentMeta?.views ?? 0 };
      return res.status(200).json(response);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[api/views] GET failed', error);
      return res.status(500).json({ error: 'Failed to fetch content meta' });
    }
  }

  if (req.method === 'POST') {
    try {
      const contentMeta = await prisma.contentmeta.update({
        where: { slug },
        data: { views: { increment: 1 } },
        select: { views: true },
      });
      return res.status(200).json(contentMeta);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[api/views] POST failed', error);
      return res.status(500).json({ error: 'Failed to update views count' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
