/**
 * Slug generation and management utilities
 * Provides SEO-friendly slug generation with uniqueness checking
 */

/**
 * Generate a clean slug from a string
 * @param {string} text - The text to convert to slug
 * @returns {string} Clean, SEO-friendly slug
 */
const generateSlug = (text) => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Remove special characters
    .replace(/[^\w\s-]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
};

/**
 * Ensure slug is unique by checking database
 * @param {Object} Model - Mongoose model to check against
 * @param {string} slug - The slug to check
 * @param {string} excludeId - Optional ID to exclude from check (for updates)
 * @returns {Promise<string>} Unique slug (may have number appended)
 */
const ensureUniqueSlug = async (Model, slug, excludeId = null) => {
  let uniqueSlug = slug;
  let counter = 1;
  
  while (true) {
    const query = { slug: uniqueSlug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const existing = await Model.findOne(query);
    
    if (!existing) {
      return uniqueSlug;
    }
    
    // Slug exists, append counter
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
};

/**
 * Generate and ensure unique slug from text
 * @param {Object} Model - Mongoose model to check against
 * @param {string} text - Text to convert to slug
 * @param {string} excludeId - Optional ID to exclude from check
 * @returns {Promise<string>} Unique slug
 */
const createUniqueSlug = async (Model, text, excludeId = null) => {
  const baseSlug = generateSlug(text);
  return await ensureUniqueSlug(Model, baseSlug, excludeId);
};

/**
 * Validate slug format
 * @param {string} slug - The slug to validate
 * @returns {boolean} True if valid
 */
const isValidSlug = (slug) => {
  if (!slug) return false;
  
  // Check if slug matches SEO-friendly pattern
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugPattern.test(slug);
};

/**
 * Generate SEO-friendly meta title
 * @param {string} title - Base title
 * @param {string} siteName - Site name to append
 * @returns {string} Formatted meta title
 */
const generateMetaTitle = (title, siteName = 'Solr Blog') => {
  if (!title) return siteName;
  return title.length > 60 ? `${title.substring(0, 57)}... | ${siteName}` : `${title} | ${siteName}`;
};

/**
 * Generate meta description from content
 * @param {string} content - Content to extract description from
 * @param {number} maxLength - Maximum length (default 160)
 * @returns {string} Meta description
 */
const generateMetaDescription = (content, maxLength = 160) => {
  if (!content) return '';
  
  // Strip HTML tags if present
  const text = content.replace(/<[^>]*>/g, '');
  
  if (text.length <= maxLength) return text;
  
  // Truncate at word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? `${truncated.substring(0, lastSpace)}...` : `${truncated}...`;
};

/**
 * Extract keywords from text
 * @param {string} text - Text to extract keywords from
 * @param {number} limit - Maximum number of keywords
 * @returns {string} Comma-separated keywords
 */
const extractKeywords = (text, limit = 10) => {
  if (!text) return '';
  
  // Remove common stop words
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those']);
  
  // Extract words
  const words = text
    .toLowerCase()
    .replace(/<[^>]*>/g, '') // Remove HTML
    .replace(/[^\w\s]/g, ' ') // Remove special chars
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));
  
  // Count frequency
  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  // Sort by frequency and take top keywords
  const keywords = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(entry => entry[0]);
  
  return keywords.join(', ');
};

module.exports = {
  generateSlug,
  ensureUniqueSlug,
  createUniqueSlug,
  isValidSlug,
  generateMetaTitle,
  generateMetaDescription,
  extractKeywords
};
