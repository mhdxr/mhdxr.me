const canonicalUrl = 'https://mhdxr.me';
const metaImage = 'https://mhdxr.me/images/og-image.png';
const metaDescription =
  'Seasoned Software Engineer especially in Frontend side, with a passion for creating pixel-perfect web experiences';

const defaultSEOConfig = {
  defaultTitle: 'mhdxr.me - Personal Website',
  description: metaDescription,
  canonical: canonicalUrl,
  openGraph: {
    canonical: canonicalUrl,
    title: 'mhdxr.me - Personal Website',
    description: metaDescription,
    type: 'website',
    images: [
      {
        url: metaImage,
        alt: 'mhdxr.me og-image',
        width: 800,
        height: 600,
      },
      {
        url: metaImage,
        alt: 'mhdxr.me og-image',
        width: 1200,
        height: 630,
      },
      {
        url: metaImage,
        alt: 'mhdxr.me og-image',
        width: 1600,
        height: 900,
      },
    ],
    site_name: 'mhdxr.me',
  },
  twitter: {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
  },
};

export default defaultSEOConfig;
