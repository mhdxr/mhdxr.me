import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';
import { BlogItemProps } from '@/common/types/blog';
import { getBlogList } from '@/services/blog';

const toPositiveInt = (value: unknown, fallback: number, max = 100): number => {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(Math.floor(n), max);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ status: false, message: 'Method not allowed' });
    return;
  }

  try {
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=30',
    );

    const { page, per_page, categories, search } = req.query;

    const responseData = await getBlogList({
      page: toPositiveInt(page, 1, 1000),
      per_page: toPositiveInt(per_page, 9, 50),
      categories: categories ? Number(categories) || undefined : undefined,
      search: typeof search === 'string' ? search.slice(0, 100) : undefined,
    });

    const posts = Array.isArray(responseData?.data?.posts)
      ? responseData.data.posts
      : [];

    const blogItemsWithViews = await Promise.all(
      posts.map(async (blogItem: BlogItemProps) => {
        const { slug } = blogItem;
        if (!slug) return { ...blogItem, total_views_count: 0 };

        const contentMeta = await prisma.contentmeta.findUnique({
          where: { slug: String(slug) },
          select: { views: true },
        });

        return {
          ...blogItem,
          total_views_count: contentMeta?.views ?? 0,
        };
      }),
    );

    res.status(200).json({
      status: true,
      data: {
        total_pages: responseData?.data?.total_pages,
        total_posts: responseData?.data?.total_posts,
        page: responseData?.data?.page,
        per_page: responseData?.data?.per_page,
        posts: blogItemsWithViews,
        categories: responseData?.data?.categories,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[api/blog] failed to load blog list', error);
    res.status(500).json({ status: false, message: 'Failed to load blog' });
  }
}
