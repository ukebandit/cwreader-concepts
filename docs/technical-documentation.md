# Document Reader Component - Technical Documentation

This document provides a comprehensive overview of the Document Reader component architecture, implementation details, and usage guide. The Document Reader is a responsive React component for displaying and navigating structured document content with advanced features like dark mode, content filtering, and mobile optimizations.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Component Structure](#component-structure)
3. [State Management](#state-management)
4. [Theme System](#theme-system)
5. [Document Structure](#document-structure)
6. [Mobile Considerations](#mobile-considerations)
7. [Customization Options](#customization-options)
8. [Implementation Details](#implementation-details)
9. [Troubleshooting](#troubleshooting)

## Architecture Overview

The Document Reader follows a modular architecture with component-based separation of concerns. It uses React Context API for state management to avoid prop drilling and maintain a clean component structure.

### Key Architectural Decisions

1. **Context-based State Management**: All state is managed centrally in `DocumentContext.jsx`
2. **Component Composition**: Features are broken down into focused components
3. **Responsive Design**: Desktop and mobile experiences are handled differently 
4. **Theming**: Dark/light mode with consistent application to all UI elements
5. **Utility Separation**: Document processing logic is extracted to utility functions

### High-level Component Interaction

```
┌─────────────────────────────────────┐
│           DocumentProvider           │
│                                     │
│  ┌─────────────┐   ┌─────────────┐  │
│  │   Header    │   │ProgressBar  │  │
│  └─────────────┘   └─────────────┘  │
│                                     │
│  ┌─────────┐ ┌─────┐ ┌───────────┐  │
│  │ TOC     │ │Main │ │ContextPanel│  │
│  │         │ │     │ │           │  │
│  └─────────┘ └─────┘ └───────────┘  │
│                                     │
│  ┌─────────────────────────────┐    │
│  │       MobileDrawer          │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

## Component Structure

The Document Reader is broken down into these main components:

### Main Components

1. **`DocumentReaderWrapper`** (`index.jsx`): 
   - Top-level wrapper component
   - Provides context to child components

2. **`Header`** (`Header.jsx`):
   - App header with navigation controls
   - Theme toggle
   - Menu button
   - Tab navigation

3. **`TableOfContents`** (`TableOfContents.jsx`):
   - Displays nested document structure
   - Supports filtering by section level
   - Handles search results display
   - Navigation controls

4. **`ContentArea`** (`ContentArea.jsx`):
   - Displays document content
   - Breadcrumb navigation
   - Font size controls
   - Progress indicator

5. **`ContextPanel`** (`ContextPanel.jsx`):
   - Displays related content
   - References
   - Notes
   - Content filter controls

6. **`MobileDrawer`** (`MobileDrawer.jsx`):
   - Bottom drawer interface for mobile
   - Content, context, and settings tabs
   - Floating action buttons

7. **`Settings`** (`Settings.jsx`):
   - Theme selection
   - Font size controls
   - Handedness preference
   - Progress bar toggle
   - Content display options

### Support Components

1. **`ProgressBar`** (`common/ProgressBar.jsx`):
   - Visual reading progress indicator

2. **`SearchResults`** (`SearchResults.jsx`):
   - Displays search results

### Context and Utils

1. **`DocumentContext`** (`context/DocumentContext.jsx`):
   - React Context for state management
   - Document loading
   - State for UI components
   - Theme and user preferences

2. **`documentUtils`** (`utils/documentUtils.js`):
   - Utility functions for document operations
   - Section finding
   - Breadcrumb generation
   - Search functionality

## State Management

The `DocumentContext` serves as the central state management solution using React's Context API. This approach eliminates prop drilling and keeps components focused on rendering rather than state management.

### Key State Categories

1. **Document State**:
   - `docContent`: Current document with title and sections
   - `activeSection`: Currently displayed section
   - `isLoading`: Loading state indicator
   - `activeContent`: Currently displayed content
   - `breadcrumbs`: Breadcrumb navigation data
   - `relatedLinks`: Related content for current section

2. **Search State**:
   - `searchQuery`: Current search input
   - `searchResults`: Matching sections

3. **UI State**:
   - `isTocCollapsed`: Table of contents visibility
   - `isContextPanelOpen`: Context panel visibility
   - `activeTab`: Current active tab
   - `drawerState`: Mobile drawer state ('closed', 'peek', 'half', 'full')
   - `activeDrawerContent`: Active content in mobile drawer

4. **User Preferences**:
   - `isLeftHanded`: Handedness preference for mobile
   - `darkMode`: Theme preference
   - `fontSize`: Text size preference
   - `showProgress`: Progress bar visibility

5. **Filter States**:
   - `tocFilters`: TOC display filters
   - `contentFilters`: Content display filters
   - `contextFilters`: Context panel display filters

### Context Usage

Components access and update state using the `useDocumentContext` hook:

```jsx
const { 
  theme, 
  activeSection, 
  handleSectionClick 
} = useDocumentContext();
```

## Theme System

The theme system provides consistent styling across all components with support for both light and dark modes.

### Theme Structure

Themes are generated by the `getThemeClasses` function in `DocumentContext.jsx`:

```javascript
const getThemeClasses = () => {
  if (darkMode) {
    return {
      bg: 'bg-gray-900',
      text: 'text-gray-100',
      border: 'border-gray-700',
      panel: 'bg-gray-800',
      // Additional theme properties...
    };
  } else {
    return {
      bg: 'bg-gray-50',
      text: 'text-gray-900',
      border: 'border-gray-200',
      panel: 'bg-white',
      // Additional theme properties...
    };
  }
};
```

### Theme Usage

Components access the theme through context:

```jsx
const { theme } = useDocumentContext();

return (
  <div className={`${theme.panel} ${theme.border} border-b`}>
    {/* Component content */}
  </div>
);
```

## Document Structure

The document is represented as a nested structure of sections:

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

### Key Document Properties

- `id`: Unique identifier for each section
- `title`: Section title
- `level`: Nesting level (1 = top level, 2 = second level, etc.)
- `content`: Main content text
- `subsections`: Array of child sections

## Mobile Considerations

The Document Reader is built with mobile-first design principles and includes specific optimizations for mobile devices.

### Mobile-specific Features

1. **Bottom Drawer**: Mobile interface uses a bottom drawer pattern with multiple states (peek, half, full)
2. **Thumb Controls**: FAB button cluster positioned based on handedness preference
3. **Touch-optimized UI**: Larger touch targets on mobile
4. **Responsive Layout**: Content adapts to available screen space

### Drawer States

The mobile drawer has four states controlled by the `drawerState` value:
- `closed`: Drawer is hidden
- `peek`: Drawer shows a small handle
- `half`: Drawer covers half the screen
- `full`: Drawer covers most of the screen

## Customization Options

Users can customize their reading experience through various settings:

1. **Theme**: Light or dark mode
2. **Font Size**: Small, medium, large, or x-large
3. **Handedness**: Controls positioning for one-handed use
4. **Progress Bar**: Show or hide reading progress
5. **Content Display**: Toggle visibility of images, tables, and code blocks

## Implementation Details

### Document Navigation

The `navigateSection` function handles next/previous navigation between sections:

```javascript
const navigateSection = (direction) => {
  if (!activeSection || !docContent.sections) return;
  
  const flattenSections = (sections, results = []) => {
    sections.forEach(section => {
      results.push(section);
      if (section.subsections && section.subsections.length > 0) {
        flattenSections(section.subsections, results);
      }
    });
    return results;
  };
  
  const allSections = flattenSections(docContent.sections);
  const currentIndex = allSections.findIndex(section => section.id === activeSection);
  
  if (currentIndex === -1) return;
  
  let newIndex;
  if (direction === 'next') {
    newIndex = currentIndex + 1;
    if (newIndex >= allSections.length) {
      newIndex = 0; // Wrap around to first section
    }
  } else {
    newIndex = currentIndex - 1;
    if (newIndex < 0) {
      newIndex = allSections.length - 1; // Wrap around to last section
    }
  }
  
  setActiveSection(allSections[newIndex].id);
  handleSectionClick(allSections[newIndex].id);
};
```

### Search Implementation

Search is implemented by flattening the document structure and checking for matches:

```javascript
useEffect(() => {
  if (!searchQuery.trim()) {
    setSearchResults([]);
    return;
  }

  const flattenSections = (sections, results = []) => {
    sections.forEach(section => {
      if (section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          section.content.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push(section);
      }
      if (section.subsections && section.subsections.length > 0) {
        flattenSections(section.subsections, results);
      }
    });
    return results;
  };

  const results = flattenSections(docContent.sections || []);
  setSearchResults(results);
}, [searchQuery, docContent.sections]);
```

### Progress Calculation

Reading progress is calculated based on the current section's position in the flattened document:

```javascript
const calculateProgress = () => {
  if (!activeSection || !docContent.sections) return 0;
  
  const flattenSections = (sections, results = []) => {
    sections.forEach(section => {
      results.push(section);
      if (section.subsections && section.subsections.length > 0) {
        flattenSections(section.subsections, results);
      }
    });
    return results;
  };
  
  const allSections = flattenSections(docContent.sections);
  const currentIndex = allSections.findIndex(section => section.id === activeSection);
  
  if (currentIndex === -1) return 0;
  return Math.round((currentIndex + 1) / allSections.length * 100);
};
```

## Troubleshooting

### Common Issues

1. **Drawer Not Working Properly on Mobile**
   - Check if the touch events are properly handled
   - Verify the drawer state transitions

2. **Theme Not Applied Consistently**
   - Ensure all components are accessing the theme through context
   - Check for hardcoded color values that bypass the theme system

3. **Section Navigation Issues**
   - Verify section IDs are unique
   - Check document structure for inconsistencies

4. **Search Not Finding Expected Results**
   - Confirm the search logic is correctly implemented
   - Check for case sensitivity issues

5. **Context Not Available Error**
   - Make sure all components are wrapped in the `DocumentProvider`
   - Verify correct usage of the `useDocumentContext` hook

---

This documentation provides a comprehensive overview of the Document Reader component. For more detailed information, refer to the individual component files and comments within the code.
