import React, { useState, useEffect, MouseEvent } from 'react';
import { 
  Printer, FileText, Mail, MessageSquare, Link, Copy, 
  Twitter, Facebook, Linkedin, Bookmark, Share, X, 
  Download, Code, ExternalLink, LucideIcon
} from 'lucide-react';
import { useDocumentContext } from '../../context/DocumentContext';
import { ThemeClasses, DocumentSection } from '../../context/DocumentContext';
import { 
  generateShareableUrl, shareContent, copyToClipboard 
} from '../../utils/shareUtils';

interface ShareStatus {
  success: boolean;
  message: string;
}

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  section: DocumentSection | null;
}

interface ShareButtonProps {
  Icon: LucideIcon;
  label: string;
  onClick: () => void;
  theme: ThemeClasses;
  primary?: boolean;
  small?: boolean;
}

interface ShareContactProps {
  image: string;
  label: string;
  onClick: () => void;
  theme: ThemeClasses;
}

type ShareAction = 
  | 'print'
  | 'pdf'
  | 'email'
  | 'message'
  | 'twitter'
  | 'facebook'
  | 'linkedin'
  | 'copy-link'
  | 'copy-text'
  | 'bookmark'
  | 'native'
  | 'more';

const ShareSheet: React.FC<ShareSheetProps> = ({ isOpen, onClose, section }) => {
  const { theme, docContent } = useDocumentContext();
  const [shareStatus, setShareStatus] = useState<ShareStatus | null>(null);
  const [animateIn, setAnimateIn] = useState<boolean>(false);
  
  // Detect device type
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const hasNativeShare = !!navigator.share;
  
  // Animation effect
  useEffect(() => {
    let animationTimer: NodeJS.Timeout | undefined;
    if (isOpen) {
      // Small delay to ensure component is mounted before animation starts
      animationTimer = setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
    }
    
    // Cleanup timer on component unmount
    return () => {
      if (animationTimer) clearTimeout(animationTimer);
    };
  }, [isOpen]);
  
  // Share action handler
  const handleShare = async (action: ShareAction) => {
    try {
      const title = section?.title || docContent.title;
      const url = generateShareableUrl(section?.id);
      const shareText = section?.content?.substring(0, 150) || '';
      const text = `${title}\n\n${shareText}`;
      
      switch(action) {
        case 'print':
          window.print();
          setShareStatus({ success: true, message: 'Print dialog opened' });
          break;
          
        case 'pdf':
          // In a real app, this would trigger PDF generation
          setShareStatus({ success: true, message: 'PDF download started' });
          break;
          
        case 'email':
          window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`);
          setShareStatus({ success: true, message: 'Email client opened' });
          break;
          
        case 'message':
          // On mobile, this would use the native share API with SMS option
          if (navigator.share) {
            await navigator.share({
              title,
              text,
              url
            });
            setShareStatus({ success: true, message: 'Share sheet opened' });
          } else {
            // Fallback for desktop - just copy text
            await copyToClipboard(text + ' ' + url);
            setShareStatus({ success: true, message: 'Content copied (messaging not available on this device)' });
          }
          break;
          
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title} ${url}`)}`);
          setShareStatus({ success: true, message: 'Twitter opened' });
          break;
          
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
          setShareStatus({ success: true, message: 'Facebook opened' });
          break;
          
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
          setShareStatus({ success: true, message: 'LinkedIn opened' });
          break;
          
        case 'copy-link':
          await copyToClipboard(url);
          setShareStatus({ success: true, message: 'Link copied to clipboard' });
          break;
          
        case 'copy-text':
          await copyToClipboard(section?.content || text);
          setShareStatus({ success: true, message: 'Text copied to clipboard' });
          break;
          
        case 'bookmark':
          // This would interface with your bookmark system
          setShareStatus({ success: true, message: 'Added to bookmarks' });
          break;
          
        case 'native':
          if (navigator.share) {
            await navigator.share({
              title,
              text,
              url
            });
            setShareStatus({ success: true, message: 'Share sheet opened' });
          } else {
            // Better fallback for desktop - show status message
            setShareStatus({ success: false, message: 'Native sharing not available. Please use other options.' });
          }
          break;
          
        case 'more':
          // For 'More' button, either open native share or show all options
          if (navigator.share) {
            await navigator.share({
              title,
              text,
              url
            });
            setShareStatus({ success: true, message: 'Share sheet opened' });
          } else {
            // Just provide feedback for now
            setShareStatus({ success: true, message: 'Use the options above to share' });
          }
          break;
          
        default:
          setShareStatus({ success: false, message: 'Share action not implemented' });
      }
    } catch (error) {
      console.error('Share error:', error);
      // More descriptive error message
      let errorMessage = 'Share failed';
      if (error instanceof Error) {
        errorMessage = error.message === 'AbortError' 
          ? 'Sharing was cancelled' 
          : error.message;
      }
      setShareStatus({ 
        success: false, 
        message: errorMessage
      });
    }
    
    // Reset status after 2.5 seconds (slightly longer for better readability)
    const statusTimer = setTimeout(() => {
      setShareStatus(null);
    }, 2500);
    
    // Return cleanup function to clear the timer
    return () => clearTimeout(statusTimer);
  };
  
  // Handle close with animation
  const handleClose = () => {
    setAnimateIn(false);
    // Wait for animation to complete before fully closing
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  // Don't render anything if not open
  if (!isOpen) return null;
  
  // iOS-style sheet for mobile devices
  if (isMobile) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 transition-opacity duration-300"
        style={{ opacity: animateIn ? 1 : 0 }}
        onClick={handleClose}
      >
        <div 
          className={`${theme.panel} w-full mx-auto max-h-[85vh] overflow-y-auto rounded-t-xl transition-transform duration-300 transform ${animateIn ? 'translate-y-0' : 'translate-y-full'}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            paddingBottom: isIOS ? '2rem' : '1rem' // Extra padding for iOS devices to account for home indicator
          }}
        >
          {/* Pull indicator (iOS style) */}
          <div className="w-full flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          </div>
          
          {/* Share target title */}
          <div className="px-4 pt-2 pb-4">
            <h3 className="text-lg font-medium">{section?.title || docContent.title}</h3>
            {section?.content && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                {section.content.substring(0, 60)}...
              </p>
            )}
          </div>
          
          {/* AirDrop and Contacts (iOS style) */}
          {isIOS && hasNativeShare && (
            <div className="px-4 mb-6">
              <h4 className="text-sm font-medium mb-3 text-gray-500 dark:text-gray-400">AirDrop</h4>
              <div className="flex overflow-x-auto space-x-4 pb-2">
                <ShareContact 
                  image="/api/placeholder/48/48" 
                  label="AirDrop" 
                  theme={theme} 
                  onClick={() => handleShare('native')}
                />
              </div>
            </div>
          )}
          
          {/* Primary share actions */}
          <div className="px-4 mb-6">
            <div className="grid grid-cols-4 gap-y-4 gap-x-2">
              {hasNativeShare && (
                <ShareButton 
                  Icon={Share} 
                  label="Share" 
                  onClick={() => handleShare('native')} 
                  theme={theme} 
                  primary={true}
                />
              )}
              
              <ShareButton 
                Icon={MessageSquare} 
                label="Messages" 
                onClick={() => handleShare('message')} 
                theme={theme}
              />
              
              <ShareButton 
                Icon={Mail} 
                label="Mail" 
                onClick={() => handleShare('email')} 
                theme={theme}
              />
              
              <ShareButton 
                Icon={Copy} 
                label="Copy" 
                onClick={() => handleShare('copy-text')} 
                theme={theme}
              />
              
              <ShareButton 
                Icon={Bookmark} 
                label="Bookmark" 
                onClick={() => handleShare('bookmark')} 
                theme={theme}
              />
              
              <ShareButton 
                Icon={FileText} 
                label="PDF" 
                onClick={() => handleShare('pdf')} 
                theme={theme}
              />
              
              <ShareButton 
                Icon={Printer} 
                label="Print" 
                onClick={() => handleShare('print')} 
                theme={theme}
              />
              
              <ShareButton 
                Icon={Link} 
                label="Copy Link" 
                onClick={() => handleShare('copy-link')} 
                theme={theme}
              />
            </div>
          </div>
          
          {/* Apps section (iOS style) */}
          <div className="px-4 mb-4">
            <h4 className="text-sm font-medium mb-3 text-gray-500 dark:text-gray-400">Apps</h4>
            <div className="grid grid-cols-4 gap-y-4 gap-x-2">
              <ShareButton 
                Icon={Twitter} 
                label="Twitter" 
                onClick={() => handleShare('twitter')} 
                theme={theme}
                small={true}
              />
              
              <ShareButton 
                Icon={Facebook} 
                label="Facebook" 
                onClick={() => handleShare('facebook')} 
                theme={theme}
                small={true}
              />
              
              <ShareButton 
                Icon={Linkedin} 
                label="LinkedIn" 
                onClick={() => handleShare('linkedin')} 
                theme={theme}
                small={true}
              />
              
              <ShareButton 
                Icon={ExternalLink} 
                label="More" 
                onClick={() => handleShare('more')} 
                theme={theme}
                small={true}
              />
            </div>
          </div>
          
          {/* Status message */}
          {shareStatus && (
            <div className={`mx-4 mt-2 mb-4 p-2 rounded text-center ${
              shareStatus.success 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            }`}>
              {shareStatus.message}
            </div>
          )}
          
          {/* Cancel button (iOS style) */}
          <div className="px-4 pt-2">
            <button
              className={`w-full py-3 rounded-xl font-medium ${theme.panel} ${theme.border} border`}
              onClick={handleClose}
              aria-label="Cancel sharing"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Desktop modal
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      style={{ opacity: animateIn ? 1 : 0 }}
      onClick={handleClose}
    >
      <div 
        className={`${theme.panel} rounded-2xl p-4 md:p-6 max-w-md w-full mx-4 transition-transform duration-300 transform ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Share</h3>
          <button 
            className={`${theme.button} p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800`}
            onClick={handleClose}
            aria-label="Close share dialog"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Share target title */}
        <div className={`mb-6 ${theme.border} px-4 py-3 rounded-lg border`}>
          <h4 className="font-medium mb-1">{section?.title || docContent.title}</h4>
          {section?.content && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {section.content.substring(0, 100)}...
            </p>
          )}
        </div>
        
        {/* Primary share actions (desktop style) */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {hasNativeShare && (
            <ShareButton 
              Icon={Share} 
              label="Share" 
              onClick={() => handleShare('native')} 
              theme={theme} 
              primary={true}
            />
          )}
          
          <ShareButton 
            Icon={Printer} 
            label="Print" 
            onClick={() => handleShare('print')} 
            theme={theme}
          />
          
          <ShareButton 
            Icon={FileText} 
            label="PDF" 
            onClick={() => handleShare('pdf')} 
            theme={theme}
          />
          
          <ShareButton 
            Icon={Mail} 
            label="Email" 
            onClick={() => handleShare('email')} 
            theme={theme}
          />
          
          {!hasNativeShare && (
            <ShareButton 
              Icon={MessageSquare} 
              label="Message" 
              onClick={() => handleShare('message')} 
              theme={theme}
            />
          )}
        </div>
        
        {/* Secondary share actions */}
        <h4 className="text-sm font-medium mb-3 text-gray-500 dark:text-gray-400">More Options</h4>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <ShareButton 
            Icon={Link} 
            label="Copy Link" 
            onClick={() => handleShare('copy-link')} 
            theme={theme}
            small={true}
          />
          
          <ShareButton 
            Icon={Copy} 
            label="Copy Text" 
            onClick={() => handleShare('copy-text')} 
            theme={theme}
            small={true}
          />
          
          <ShareButton 
            Icon={Bookmark} 
            label="Bookmark" 
            onClick={() => handleShare('bookmark')} 
            theme={theme}
            small={true}
          />
          
          <ShareButton 
            Icon={Download} 
            label="Save" 
            onClick={() => handleShare('pdf')} 
            theme={theme}
            small={true}
          />
        </div>
        
        {/* Social share */}
        <h4 className="text-sm font-medium mb-3 text-gray-500 dark:text-gray-400">Social</h4>
        <div className="grid grid-cols-4 gap-4">
          <ShareButton 
            Icon={Twitter} 
            label="Twitter" 
            onClick={() => handleShare('twitter')} 
            theme={theme}
            small={true}
          />
          
          <ShareButton 
            Icon={Facebook} 
            label="Facebook" 
            onClick={() => handleShare('facebook')} 
            theme={theme}
            small={true}
          />
          
          <ShareButton 
            Icon={Linkedin} 
            label="LinkedIn" 
            onClick={() => handleShare('linkedin')} 
            theme={theme}
            small={true}
          />
          
          <ShareButton 
            Icon={ExternalLink} 
            label="More" 
            onClick={() => handleShare('more')} 
            theme={theme}
            small={true}
          />
        </div>
        
        {/* Status message */}
        {shareStatus && (
          <div className={`mt-4 p-2 rounded text-center ${
            shareStatus.success 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
          }`}>
            {shareStatus.message}
          </div>
        )}
      </div>
    </div>
  );
};

// Button component for share actions
const ShareButton: React.FC<ShareButtonProps> = ({ Icon, label, onClick, theme, primary = false, small = false }) => {
  const baseClasses = primary 
    ? `bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 ${theme.hoverBg}` 
    : `${theme.button} ${theme.hoverBg}`;
  
  return (
    <button 
      className="flex flex-col items-center justify-center"
      onClick={(e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        onClick();
      }}
      aria-label={`Share via ${label}`}
    >
      <div className={`${small ? 'w-12 h-12' : 'w-14 h-14'} rounded-full ${baseClasses} flex items-center justify-center mb-1`}>
        <Icon size={small ? 18 : 22} />
      </div>
      <span className={`text-xs ${theme.text}`}>{label}</span>
    </button>
  );
};

// Contact component for AirDrop-style sharing (iOS)
const ShareContact: React.FC<ShareContactProps> = ({ image, label, onClick, theme }) => {
  return (
    <button 
      className="flex flex-col items-center justify-center"
      onClick={(e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        onClick();
      }}
      aria-label={`Share via ${label}`}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden mb-1 border border-gray-200 dark:border-gray-700">
        <img src={image} alt={label} className="w-full h-full object-cover" />
      </div>
      <span className={`text-xs ${theme.text}`}>{label}</span>
    </button>
  );
};

export default ShareSheet;