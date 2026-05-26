import { NextApiRequest, NextApiResponse } from 'next';

import { sendMessage } from '@/services/contact';

const FORM_API_KEY = process.env.CONTACT_FORM_API_KEY;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const MAX_FIELD_LENGTH = 5000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res
      .status(405)
      .json({ status: false, message: 'Method not allowed' });
  }

  if (!FORM_API_KEY) {
    return res
      .status(503)
      .json({ status: false, message: 'Contact form is not configured' });
  }

  const { formData } = (req.body ?? {}) as { formData?: unknown };
  if (!isPlainObject(formData)) {
    return res
      .status(400)
      .json({ status: false, message: 'Invalid form data' });
  }

  try {
    const updatedFormData = new FormData();
    updatedFormData.append('access_key', FORM_API_KEY);

    for (const [key, rawValue] of Object.entries(formData)) {
      // Reject non-primitive values to avoid `[object Object]` payloads.
      if (
        rawValue == null ||
        typeof rawValue === 'object' ||
        typeof rawValue === 'function'
      ) {
        continue;
      }
      const value = String(rawValue).slice(0, MAX_FIELD_LENGTH);
      updatedFormData.append(key, value);
    }

    const response = await sendMessage(updatedFormData);
    return res
      .status(200)
      .json({ status: true, message: response?.data?.message ?? 'ok' });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[api/contact] failed to send message', error);
    return res
      .status(500)
      .json({ status: false, message: 'Something went wrong' });
  }
}
