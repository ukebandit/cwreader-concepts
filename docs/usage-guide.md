# Document Reader - Usage Guide

This guide explains how to integrate, customize, and extend the Document Reader component in your React application.

## Table of Contents
1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [Providing Document Content](#providing-document-content)
4. [Customization](#customization)
5. [Extending Functionality](#extending-functionality)
6. [Performance Considerations](#performance-considerations)
7. [Accessibility](#accessibility)

## Installation

The Document Reader component relies on the following dependencies:

- React (16.8+)
- Tailwind CSS
- Lucide React (for icons)

Make sure these are installed in your project:

```bash
# Using npm
npm install react react-dom lucide-react

# Using yarn
yarn add react react-dom lucide-react
```

Ensure Tailwind CSS is properly set up in your project. If not, follow the [official Tailwind CSS installation guide](https://tailwindcss.com/docs/installation).

## Basic Usage

Import and use the DocumentReader component in your React application:

```jsx
import React from 'react';
import DocumentReader from './components/DocumentReader';

function App() {
  return (
    <div className="App">
      <DocumentReader />
    </div>
  );
}

export default App;
```

This will render the Document Reader with default sample content. For real usage, you'll want to provide your own document content.

## Providing Document Content

To use your own document content, you can modify the `loadDocument` function in `DocumentContext.jsx`:

```jsx
// Inside the useEffect hook in DocumentContext.jsx
useEffect(() => {
  const loadDocument = async () => {
    setIsLoading(true);
    
    try {
      // Option 1: Fetch from an API
      const response = await fetch('/api/documents/123');
      const data = await response.json();
      setDocContent(data);
      
      // Option 2: Import from a local file
      // import documentData from '../data/document.json';
      // setDocContent(documentData);
      
      // Set the initial active section
      setActiveSection(data.sections[0].id);
    } catch (error) {
      console.error('Error loading document:', error);
      // Handle error state
    } finally {
      setIsLoading(false);
    }
  };

  loadDocument();
}, []);
```

### Document Structure Format

Your document data should follow this structure:

```javascript
{
  title: 'Your Document Title',
  sections: [
    {
      id: 'unique-id-1',
      title: 'Section 1',
      level: 1,
      content: 'Content for section 1...',
      subsections: [
        {
          id: 'unique-id-1-1',
          title: 'Subsection 1.1',
          level: 2,
          content: 'Content for subsection 1.1...',
          subsections: []
        }
      ]
    },
    // More sections...
  ]
}
```

## Customization

### Theme Customization

You can customize the theme colors by modifying the `getThemeClasses` function in `DocumentContext.jsx`:

```jsx
const getThemeClasses = () => {
  if (darkMode) {
    return {
      bg: 'bg-slate-900', // Changed from gray-900
      text: 'text-slate-100', // Changed from gray-100
      border: 'bg-slate-700', // Changed from gray-700
      // Modify other properties...
    };
  } else {
    return {
      bg: 'bg-white', // Changed from gray-50
      text: 'text-slate-900', // Changed from gray-900
      border: 'border-slate-200', // Changed from gray-200
      // Modify other properties...
    };
  }
};
```

### Default Preferences

Set default user preferences by modifying the initial state in `DocumentContext.jsx`:

```jsx
// User preferences
const [isLeftHanded, setIsLeftHanded] = useState(false); // Default: right-handed
const [darkMode, setDarkMode] = useState(true); // Default: dark mode
const [fontSize, setFontSize] = useState('large'); // Default: large font
const [showProgress, setShowProgress] = useState(true); // Default: show progress
```

### Custom Icons

To use different icons, replace the Lucide React imports with your preferred icon library:

```jsx
// Replace Lucide icons with your custom icons
// import { Search, Menu, ... } from 'lucide-react';
import { Search, Menu, ... } from 'your-icon-library';
```

## Extending Functionality

### Adding New Features

To add new features, you can extend the existing components or create new ones.

Example: Adding a print button to the header:

```jsx
// In Header.jsx
import { Printer } from 'lucide-react';

// Add to your component
const Header = () => {
  // Existing code...
  
  // Add a print function
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <header className={/* existing classes */}>
      {/* Existing code... */}
      
      {/* Add print button */}
      <button 
        className={`${theme.button}`}
        onClick={handlePrint}
        title="Print document"
      >
        <Printer size={18} />
      </button>
      
      {/* Existing code... */}
    </header>
  );
};
```

### Adding Document Annotations

To add annotation functionality, you'll need to:

1. Add annotation state to the context
2. Create UI components for adding and displaying annotations
3. Implement annotation saving/loading logic

Example state in `DocumentContext.jsx`:

```jsx
// Add to your existing state
const [annotations, setAnnotations] = useState({});

// Add a function to create annotations
const addAnnotation = (sectionId, text, color = 'yellow') => {
  setAnnotations(prev => ({
    ...prev,
    [sectionId]: [
      ...(prev[sectionId] || []),
      {
        id: Date.now(),
        text,
        color,
        timestamp: new Date().toISOString()
      }
    ]
  }));
};

// Add to the context value
const value = {
  // Existing values...
  annotations,
  addAnnotation
};
```

## Performance Considerations

### Large Documents

For large documents with many sections, consider:

1. **Virtualized Rendering**: Implement virtualized lists for the table of contents
2. **Lazy Loading**: Load document sections on-demand
3. **Memoization**: Use React.memo and useMemo to prevent unnecessary re-renders

Example of implementing virtualized TOC:

```jsx
import { FixedSizeList } from 'react-window';

// In TableOfContents.jsx
const VirtualizedTOC = ({ items }) => {
  const Row = ({ index, style }) => (
    <div style={style} onClick={() => handleSectionClick(items[index].id)}>
      {items[index].title}
    </div>
  );

  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={35}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
};
```

### Search Optimization

For better search performance:

1. **Debouncing**: Add debounce to search input
2. **Indexing**: Pre-index document content for faster searches
3. **Worker Threads**: Move search to a web worker for large documents

Example of adding debounce:

```jsx
import { useEffect, useState } from 'react';
import { debounce } from 'lodash'; // You'll need to install lodash

// In your component
const [searchInput, setSearchInput] = useState('');

// Debounced search query
useEffect(() => {
  const debouncedSearch = debounce((value) => {
    setSearchQuery(value);
  }, 300);
  
  debouncedSearch(searchInput);
  
  return () => {
    debouncedSearch.cancel();
  };
}, [searchInput]);

// Update the input handler
<input
  type="text"
  placeholder="Search..."
  value={searchInput}
  onChange={(e) => setSearchInput(e.target.value)}
  // Other props...
/>
```

## Accessibility

The Document Reader is built with accessibility in mind, but here are some additional considerations:

### Keyboard Navigation

Ensure keyboard navigation works for all interactive elements:

1. Add appropriate `tabIndex` attributes
2. Implement keyboard shortcuts for common actions
3. Add focus styles to all interactive elements

### Screen Reader Support

Improve screen reader support:

1. Add ARIA labels and roles
2. Provide alternative text for icons
3. Announce dynamic content changes

Example of improving a button's accessibility:

```jsx
<button
  className={`${theme.button}`}
  onClick={() => setDarkMode(!darkMode)}
  title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
  aria-pressed={darkMode}
>
  {darkMode ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
</button>
```

---

By following this guide, you should be able to effectively integrate, customize, and extend the Document Reader component in your React application. For more advanced usage or specific customizations, refer to the component code and the technical documentation.
