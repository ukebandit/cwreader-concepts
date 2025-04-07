# Document Reader Component

A modern, responsive document reader component for React applications with dark mode support, content filtering, and mobile-friendly controls.

## Features

- **Responsive Design**: Works on both desktop and mobile devices
- **Dark Mode**: Full support for light/dark themes
- **Content Navigation**: Table of contents with collapsible sections
- **Search**: Full-text search within document content
- **Progress Tracking**: Visual progress indicator for reading progress
- **User Preferences**: Font size control, handedness settings, and content filters
- **Accessibility**: Proper contrast ratios and focus states

## Component Structure

```
DocumentReader/
├── index.jsx                 # Main component that composes everything
├── TableOfContents.jsx       # TOC component
├── SearchResults.jsx         # Search results component  
├── ContentArea.jsx           # Main content display
├── ContextPanel.jsx          # Right sidebar with related content
├── MobileDrawer.jsx          # Mobile-specific drawer component
├── Header.jsx                # App header with navigation
└── Settings.jsx              # Settings panel content
```

## Usage

Import the DocumentReader component:

```jsx
import DocumentReader from './components/DocumentReader';

function App() {
  return (
    <div className="App">
      <DocumentReader />
    </div>
  );
}
```

The component uses React Context for state management, so all state is contained within the component.

## Document Structure

The document structure follows this format:

```javascript
{
  title: 'Document Title',
  sections: [
    {
      id: 'section-1',
      title: 'Section Title',
      level: 1,
      content: 'Section content...',
      subsections: [
        {
          id: 'section-1-1',
          title: 'Subsection Title',
          level: 2,
          content: 'Subsection content...',
          subsections: []
        }
      ]
    }
  ]
}
```

## Dependencies

- React 16.8+ (for Hooks)
- Tailwind CSS
- Lucide React (for icons)
