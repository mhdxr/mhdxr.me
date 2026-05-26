import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

type ProjectListResponse =
  | { status: true; data: unknown }
  | { status: false; message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProjectListResponse>,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res
      .status(405)
      .json({ status: false, message: 'Method not allowed' });
  }

  try {
    const response = await prisma.projects.findMany({
      where: { is_show: true },
      orderBy: [{ is_featured: 'desc' }, { updated_at: 'desc' }],
    });
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=30',
    );
    return res.status(200).json({ status: true, data: response });
  } catch (error) {
    // Log full error server-side, return a generic message to clients.
    // eslint-disable-next-line no-console
    console.error('[api/projects] failed to load projects', error);
    return res
      .status(500)
      .json({ status: false, message: 'Failed to load projects' });
  }
}
