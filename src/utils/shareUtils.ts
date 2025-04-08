/**
 * Utility functions for sharing document content
 */

interface ShareOptions {
  baseUrl?: string;
}

interface ShareData {
  title: string;
  text?: string;
  url: string;
}

interface ShareObject {
  action: string;
  href: string;
  target: string;
}

type SocialPlatform = 'twitter' | 'facebook' | 'linkedin';

/**
 * Generate a shareable URL for a document section
 * @param sectionId - ID of the section to share
 * @param options - Additional options
 * @returns Shareable URL
 */
export const generateShareableUrl = (sectionId?: string, options: ShareOptions = {}): string => {
  const { baseUrl = window.location.origin + window.location.pathname } = options;
  const url = new URL(baseUrl);
  
  if (sectionId) {
    url.searchParams.set('section', sectionId);
  }
  
  return url.toString();
};

/**
 * Share content using the Web Share API if available
 * @param shareData - Data to share
 * @param fallback - Fallback function if Web Share API is not available
 * @returns Promise resolving to success status
 */
export const shareContent = async (
  shareData: ShareData, 
  fallback?: (data: ShareData) => Promise<boolean> | boolean
): Promise<boolean> => {
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
 * @param data - Share data
 * @returns Email share object
 */
export const generateEmailShare = (data: ShareData): ShareObject => {
  const { title, text = '', url } = data;
  
  return {
    action: 'email',
    href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`,
    target: '_blank'
  };
};

/**
 * Generate a share object for social media sharing
 * @param data - Share data
 * @param platform - Social media platform
 * @returns Social share object or null if platform not supported
 */
export const generateSocialShare = (data: ShareData, platform: SocialPlatform): ShareObject | null => {
  const { title, text = '', url } = data;
  
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
 * @param text - Text to copy
 * @returns Promise resolving to success status
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
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
 * @param content - Document content
 * @param filename - Output filename
 * @returns Promise resolving to success status
 */
export const generatePDF = async (content: unknown, filename = 'document.pdf'): Promise<boolean> => {
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