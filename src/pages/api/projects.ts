/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

type Data = {
  status: boolean;
  data?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: false, error: 'Method not allowed' });
  }

  try {
    const response = await prisma.projects.findMany({
      where: {
        is_show: true,
      },
      orderBy: [
        {
          is_featured: 'desc',
        },
        {
          updated_at: 'desc',
        },
      ],
    });

    return res.status(200).json({ status: true, data: response });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: 'Failed to fetch projects',
    });
  }
}
