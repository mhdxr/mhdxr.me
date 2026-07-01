import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

interface ResponseData {
  views: number;
}

const getSlug = (slug: string | string[] | undefined) => {
  if (typeof slug !== 'string' || !slug.trim()) return null;
  return slug.trim();
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const slug = getSlug(req.query.slug);

  if (!slug) {
    return res.status(400).json({ error: 'Slug is required' });
  }

  if (req.method === 'GET') {
    try {
      const contentMeta = await prisma.contentmeta.findUnique({
        where: { slug },
        select: { views: true },
      });

      const contentViewsCount = contentMeta?.views ?? 0;

      const response: ResponseData = {
        views: contentViewsCount,
      };

      return res.json(response);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch content meta' });
    }
  } else if (req.method === 'POST') {
    try {
      const contentMeta = await prisma.contentmeta.upsert({
        where: { slug },
        create: {
          slug,
          type: 'blog',
          views: 1,
        },
        update: {
          views: {
            increment: 1,
          },
        },
        select: { views: true },
      });
      return res.json(contentMeta);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update views count' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
