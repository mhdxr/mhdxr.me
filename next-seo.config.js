// Single source of truth for the site URL. Override locally via SITE_URL env.
const SITE_URL = process.env.SITE_URL || 'https://mhdxr.me';
const SITE_NAME = 'mhdxr.me';
const SITE_TITLE = `${SITE_NAME} - Personal Website`;

const canonicalUrl = SITE_URL;
const metaImage = `${SITE_URL}/images/og-image.png`;
const metaDescription =
  'Seasoned Software Engineer especially in Frontend side, with a passion for creating pixel-perfect web experiences';

const defaultSEOConfig = {
  defaultTitle: SITE_TITLE,
  description: metaDescription,
  canonical: canonicalUrl,
  openGraph: {
    canonical: canonicalUrl,
    title: SITE_TITLE,
    description: metaDescription,
    type: 'website',
    locale: 'en_US',
    url: canonicalUrl,
    images: [
      {
        url: metaImage,
        alt: `${SITE_NAME} og-image`,
        width: 1200,
        height: 630,
      },
      {
        url: metaImage,
        alt: `${SITE_NAME} og-image`,
        width: 1600,
        height: 900,
      },
    ],
    site_name: SITE_NAME,
  },
  twitter: {
    // No Twitter account is publicly tied to this site; using only cardType
    // is valid and avoids broken `@handle` placeholders.
    cardType: 'summary_large_image',
  },
};

export default defaultSEOConfig;
