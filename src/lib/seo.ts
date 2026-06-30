import type { Metadata } from "next";

export const SITE_URL = "https://sacristybangkok.com";
export const SITE_NAME = "SACRISTY Bangkok";
export const DEFAULT_OG_IMAGE = "/og-image.jpg";

export const DEFAULT_METADATA = {
  title: "SACRISTY — Hard Techno Events Bangkok",
  description: "SACRISTY is Bangkok's underground hard techno promo.",
};

export const INDEXABLE_ROBOTS: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export const NOINDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
};

export const toAbsoluteUrl = (url: string) => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
};

interface PageMetadataOptions {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  openGraphType?: "website" | "profile" | "article";
  robots?: Metadata["robots"];
}

export const buildPageMetadata = ({
  title,
  description,
  canonical,
  image = DEFAULT_OG_IMAGE,
  openGraphType = "website",
  robots = INDEXABLE_ROBOTS,
}: PageMetadataOptions): Metadata => {
  const absoluteImage = toAbsoluteUrl(image);

  return {
    title,
    description,
    alternates: { canonical },
    robots,
    openGraph: {
      type: openGraphType,
      url: canonical,
      title,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: absoluteImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteImage],
    },
  };
};

export const buildBreadcrumbJsonLd = (
  items: Array<{ name: string; path: string }>,
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.path.startsWith("http") ? item.path : `${SITE_URL}${item.path}`,
  })),
});

export const buildItemListJsonLd = (
  name: string,
  items: Array<{ name: string; url: string }>,
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    url: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
  })),
});

export const buildCollectionPageJsonLd = (
  name: string,
  description: string,
  path: string,
) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name,
  description,
  url: `${SITE_URL}${path}`,
  isPartOf: {
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  },
});
