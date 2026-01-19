import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component for managing meta tags
 * @param {Object} props - SEO configuration
 * @param {string} props.title - Page title
 * @param {string} props.description - Meta description
 * @param {string} props.keywords - Meta keywords
 * @param {string} props.image - OG image URL
 * @param {string} props.url - Canonical URL
 * @param {string} props.type - OG type (default: website)
 * @param {boolean} props.noindex - Whether to add noindex meta tag
 * @param {Object} props.structuredData - JSON-LD structured data
 */
const SEO = ({
  title = '',
  description = '',
  keywords = '',
  image = '',
  url = '',
  type = 'website',
  noindex = false,
  structuredData = null,
  author = 'Solr Blog',
  siteName = 'Solr Blog',
}) => {
  const baseUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
  
  // Default values
  const defaultTitle = siteName;
  const defaultDescription = 'Welcome to Solr Blog - Your source for solar energy solutions and insights';
  const defaultImage = `${baseUrl}/logo192.png`;
  
  // Computed values
  const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const metaDescription = description || defaultDescription;
  const ogImage = image || defaultImage;
  const canonicalUrl = url || window.location.href;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots Meta Tag */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

/**
 * Generate structured data for blog posts
 */
export const generateBlogStructuredData = (blog, baseUrl) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt || blog.metaDescription,
    image: blog.featuredImage ? `${baseUrl}${blog.featuredImage}` : undefined,
    author: {
      '@type': 'Person',
      name: blog.authorName || 'Anonymous',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Solr Blog',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo192.png`,
      },
    },
    datePublished: blog.publishedDate || blog.createdAt,
    dateModified: blog.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${blog.slug}`,
    },
  };
};

/**
 * Generate structured data for products
 */
export const generateProductStructuredData = (product, baseUrl) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images && product.images.length > 0
      ? product.images.map(img => `${baseUrl}${img}`)
      : undefined,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Solr Blog',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/products/${product.slug}`,
    },
    aggregateRating: product.rating && product.numReviews > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.numReviews,
    } : undefined,
  };
};

/**
 * Generate breadcrumb structured data
 */
export const generateBreadcrumbStructuredData = (breadcrumbs, baseUrl) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${baseUrl}${crumb.path}`,
    })),
  };
};

export default SEO;
