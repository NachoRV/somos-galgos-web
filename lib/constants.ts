/**
 * Application-wide constants and configuration
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://somosgalgos.es';

/**
 * Social Media Links
 * Used in Welcome component and SEO schema
 */
export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/AsociacionSomosGalgos/',
  instagram: 'https://www.instagram.com/somos_galgos',
  twitter: 'https://x.com/somos_galgos',
  tiktok: 'https://www.tiktok.com/@somosgalgos',
  amazonWishlist: 'https://www.amazon.es/hz/wishlist/ls/8VOG5MGRKLJ1?ref_=wl_fv_le',
} as const;

/**
 * Organization Information
 */
export const ORG_INFO = {
  name: 'Somos Galgos',
  description: 'Asociación sin ánimo de lucro dedicada al rescate, protección y adopción de galgos',
  location: 'Madrid, España',
  email: 'info@somosgalgos.es',
  bizumCode: 'ONG123456', // Update with actual Bizum code if available
} as const;

/**
 * SEO Keywords
 */
export const SEO_KEYWORDS = 'galgos, adopción, rescate, Madrid, protección animal, asociación sin ánimo de lucro, acogida';
