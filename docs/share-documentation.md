# ShareSheet Component Documentation

The ShareSheet component provides a comprehensive sharing interface for the Document Reader, optimized for both desktop and mobile devices with special considerations for iOS-style interactions.

## Overview

The ShareSheet offers the following sharing capabilities:
- Native system sharing (using Web Share API when available)
- Print functionality
- PDF export
- Email sharing
- SMS/messaging (device-dependent)
- Social media sharing (Twitter, Facebook, LinkedIn)
- Copy link/content to clipboard
- Bookmark/save functionality

## Implementation

The ShareSheet adapts to the current device type, providing:
- iOS-style bottom sheet with pull indicator for iOS devices
- Android-style bottom sheet for Android devices
- Modal dialog for desktop browsers

## Component Architecture

### Props

- `isOpen` (boolean): Controls the visibility of the share sheet
- `onClose` (function): Callback to close the share sheet
- `section` (object): Current document section to share

### Internal Components

- `ShareButton`: Icon button for share actions
- `ShareContact`: Contact display for iOS-style sharing

### Animation

The component uses CSS transitions to provide smooth entrance and exit animations:
- Scale and opacity for desktop modal
- Slide up/down for mobile bottom sheet

## Usage

```jsx
// Import the component
import ShareSheet from './ShareSheet';

// Use in your component
const YourComponent = () => {
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsShareSheetOpen(true)}>
        Share
      </button>
      
      <ShareSheet 
        isOpen={isShareSheetOpen} 
        onClose={() => setIsShareSheetOpen(false)} 
        section={currentSection}
      />
    </>
  );
};
```

## Device Detection

The component detects the device type to provide the appropriate UI:

```javascript
// Detect device type
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const hasNativeShare = !!navigator.share;
```

## Share Handlers

The component uses a central `handleShare` function to process different sharing actions:

```javascript
const handleShare = async (action) => {
  try {
    // Different actions handled here (print, pdf, email, etc.)
    switch(action) {
      case 'print':
        window.print();
        break;
      
      case 'native':
        if (navigator.share) {
          await navigator.share({
            title,
            text,
            url
          });
        }
        break;
        
      // Other cases...
    }
  } catch (error) {
    console.error('Share error:', error);
  }
};
```

## iOS-Specific Considerations

For iOS devices, the component includes additional elements to match system UX patterns:
- Pull indicator at the top of the sheet
- AirDrop section with contact avatars
- "Cancel" button at the bottom
- Extra bottom padding for home indicator

## Desktop-Specific Considerations

For desktop devices, the component:
- Uses a centered modal instead of a bottom sheet
- Includes a close (X) button in the corner
- Groups share actions into categories
- Shows a tooltip with success/failure messages

## Share Utilities

The component relies on utility functions in `shareUtils.js`:
- `generateShareableUrl`: Creates a URL for sharing
- `shareContent`: Handles native sharing
- `copyToClipboard`: Copies text to clipboard with fallbacks
- `generatePDF`: Creates a PDF file (placeholder for real implementation)

## Theme Support

The ShareSheet respects the Document Reader's theming system, using the same light/dark mode styles as the rest of the application:

```javascript
const { theme } = useDocumentContext();

// Theme applied to components
<div className={`${theme.panel} ${theme.border} ...`}>
```

## Accessibility Considerations

The ShareSheet includes several accessibility features:
- Proper focus management
- Keyboard navigation
- Screen reader announcements for status changes
- High contrast for action buttons
- Appropriate ARIA attributes

## Error Handling

The component displays success or error messages to provide feedback on share operations:

```jsx
{shareStatus && (
  <div className={`mt-4 p-2 rounded text-center ${
    shareStatus.success 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
  }`}>
    {shareStatus.message}
  </div>
)}
```

## Web Share API Considerations

The Web Share API is used when available, but the component provides fallbacks for browsers that don't support it:

```javascript
if (navigator.share) {
  // Native sharing available
  await navigator.share({
    title,
    text,
    url
  });
} else {
  // Fall back to other sharing methods
}
```

## Platform Compatibility

| Feature | Desktop | iOS | Android |
|---------|---------|-----|---------|
| Native Share | ❌ | ✅ | ✅ |
| Print | ✅ | ✅ | ✅ |
| PDF | ✅ | ✅ | ✅ |
| Email | ✅ | ✅ | ✅ |
| Messages | ❌ | ✅ | ✅ |
| Copy Link | ✅ | ✅ | ✅ |
| Copy Text | ✅ | ✅ | ✅ |
| Social | ✅ | ✅ | ✅ |

## Best Practices

1. **Graceful Degradation**: Always provide fallbacks for unavailable platform features
2. **Status Feedback**: Display clear success/error messages for user actions
3. **Platform Familiarity**: Match platform-specific UX patterns for sharing
4. **Accessibility**: Ensure all sharing options are accessible to all users
5. **Animation Performance**: Use GPU-accelerated properties for smooth animations

## Integration with Document Context

The ShareSheet integrates with the DocumentContext to access:
- Current document content
- Active section data
- Theme preferences
- User settings

## Future Enhancements

Potential improvements for the ShareSheet component:
1. Support for native share target picker on compatible platforms
2. Integration with system share extensions
3. More detailed analytics for share events
4. Support for direct sharing to messaging apps
5. Custom share templates for different platforms
6. Integration with user contact list for direct sharing

## Example Usage in CW Reader

In the CW Reader application, the ShareSheet is integrated in two places:
1. Header component for desktop and tablet devices
2. Mobile Drawer component for easy access on smartphones

```jsx
// In Header.jsx
<button 
  className={`${theme.button}`}
  onClick={() => setIsShareSheetOpen(true)}
  title="Share"
>
  <Share size={18} />
</button>

<ShareSheet 
  isOpen={isShareSheetOpen} 
  onClose={() => setIsShareSheetOpen(false)} 
  section={activeContent}
/>

// In MobileDrawer.jsx
<button 
  className="h-12 w-12 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center"
  onClick={() => setIsShareSheetOpen(true)}
>
  <Share size={20} />
</button>

<ShareSheet 
  isOpen={isShareSheetOpen} 
  onClose={() => setIsShareSheetOpen(false)} 
  section={activeContent}
/>
```
