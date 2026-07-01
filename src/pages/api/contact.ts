import { NextApiRequest, NextApiResponse } from 'next';

import { sendMessage } from '@/services/contact';

const FORM_API_KEY = process.env.CONTACT_FORM_API_KEY as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formData } = req.body;

    if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
      return res.status(400).json({ error: 'Invalid form data' });
    }

    const updatedFormData = new FormData();
    updatedFormData.append('access_key', FORM_API_KEY);

    for (const key in formData) {
      updatedFormData.append(key, String(formData[key]));
    }

    const response = await sendMessage(updatedFormData);

    return res
      .status(200)
      .json({ status: 200, message: response?.data?.message });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong!' });
  }
}
