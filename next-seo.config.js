const canonicalUrl = 'https://mhdxr.me';
const metaImage = 'https://mhdxr.me/images/og-image.png'; // siapkan file OG image di /public/images
const metaDescription =
  'Personal website of Yudda Aditiya — sharing projects, writings, and things I learn.'; // ganti sesuai selera

const defaultSEOConfig = {
  defaultTitle: 'Yudda Aditiya - Personal Website',
  description: metaDescription,
  canonical: canonicalUrl,
  openGraph: {
    canonical: canonicalUrl,
    title: 'Yudda Aditiya - Personal Website',
    description: metaDescription,
    type: 'website',
    images: [
      { url: metaImage, alt: 'mhdxr.me og-image', width: 800, height: 600 },
      { url: metaImage, alt: 'mhdxr.me og-image', width: 1200, height: 630 },
      { url: metaImage, alt: 'mhdxr.me og-image', width: 1600, height: 900 },
    ],
    site_name: 'mhdxr.me',
  },
  twitter: {
    handle: '@mhdxr', // ganti kalau handle X kamu berbeda
    site: '@mhdxr',
    cardType: 'summary_large_image',
  },
};

export default defaultSEOConfig;