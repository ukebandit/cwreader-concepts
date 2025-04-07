/**
 * Utility functions for sharing document content
 */

/**
 * Generate a shareable URL for a document section
 * @param {string} sectionId - ID of the section to share
 * @param {Object} options - Additional options
 * @returns {string} Shareable URL
 */
export const generateShareableUrl = (sectionId, options = {}) => {
  const { baseUrl = window.location.origin + window.location.pathname } = options;
  const url = new URL(baseUrl);
  
  if (sectionId) {
    url.searchParams.set('section', sectionId);
  }
  
  return url.toString();
};

/**
 * Share content using the Web Share API if available
 * @param {Object} shareData - Data to share
 * @param {function} fallback - Fallback function if Web Share API is not available
 * @returns {Promise<boolean>} Success status
 */
export const shareContent = async (shareData, fallback) => {
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return true;
    } else if (fallback) {
      return fallback(shareData);
    }
    return false;
  } catch (error) {
    console.error('Share error:', error);
    return false;
  }
};

/**
 * Generate a share object for email sharing
 * @param {Object} data - Share data
 * @returns {Object} Email share object
 */
export const generateEmailShare = (data) => {
  const { title, text, url } = data;
  
  return {
    action: 'email',
    href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`,
    target: '_blank'
  };
};

/**
 * Generate a share object for social media sharing
 * @param {Object} data - Share data
 * @param {string} platform - Social media platform
 * @returns {Object} Social share object
 */
export const generateSocialShare = (data, platform) => {
  const { title, text, url } = data;
  
  switch (platform) {
    case 'twitter':
      return {
        action: 'twitter',
        href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        target: '_blank'
      };
      
    case 'facebook':
      return {
        action: 'facebook',
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        target: '_blank'
      };
      
    case 'linkedin':
      return {
        action: 'linkedin',
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        target: '_blank'
      };
      
    default:
      return null;
  }
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Copy error:', error);
    
    // Fallback for browsers that don't support the Clipboard API
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    } catch (fallbackError) {
      console.error('Copy fallback error:', fallbackError);
      return false;
    }
  }
};

/**
 * Generate a PDF from document content
 * @param {Object} content - Document content
 * @param {string} filename - Output filename
 * @returns {Promise<boolean>} Success status
 */
export const generatePDF = async (content, filename = 'document.pdf') => {
  // This is a placeholder for PDF generation functionality
  // In a real app, you would use a library like jsPDF or a server-side service
  
  console.log('PDF generation requested:', { content, filename });
  
  // Return success for demonstration purposes
  return true;
};

export default {
  generateShareableUrl,
  shareContent,
  generateEmailShare,
  generateSocialShare,
  copyToClipboard,
  generatePDF
};