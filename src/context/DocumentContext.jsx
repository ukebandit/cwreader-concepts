import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const DocumentContext = createContext(null);

// Custom hook to use the document context
export const useDocumentContext = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocumentContext must be used within a DocumentProvider');
  }
  return context;
};

// Provider component
export const DocumentProvider = ({ children }) => {
  // Document state
  const [docContent, setDocContent] = useState({ 
    title: '', 
    sections: [] 
  });
  const [activeSection, setActiveSection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // UI state
  const [isTocCollapsed, setIsTocCollapsed] = useState(false);
  const [isContextPanelOpen, setIsContextPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('document');
  const [drawerState, setDrawerState] = useState('closed'); // closed, peek, half, full
  const [activeDrawerContent, setActiveDrawerContent] = useState('toc'); // toc, context, settings
  
  // User preferences
  const [isLeftHanded, setIsLeftHanded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium'); // small, medium, large, x-large
  const [showProgress, setShowProgress] = useState(true);
  
  // Filter selection states
  const [tocFilters, setTocFilters] = useState({
    chapters: true,
    sections: true,
    subsections: true
  });
  
  const [contentFilters, setContentFilters] = useState({
    images: true,
    tables: true,
    code: true
  });
  
  const [contextFilters, setContextFilters] = useState({
    related: true,
    references: true,
    notes: true
  });

  // Simulate loading a document
  useEffect(() => {
    const loadDocument = async () => {
      setIsLoading(true);
      // In a real app, you'd fetch this from an API or file
      setTimeout(() => {
        setDocContent({
          title: 'Modern Document Systems',
          sections: [
            {
              id: 'section-1',
              title: 'Introduction',
              level: 1,
              content: 'This is the introduction to our document. It contains important information about what you will learn.',
              subsections: [
                {
                  id: 'section-1-1',
                  title: 'Purpose',
                  level: 2,
                  content: 'The purpose of this document is to demonstrate a React-based document reader.',
                  subsections: []
                },
                {
                  id: 'section-1-2',
                  title: 'Audience',
                  level: 2,
                  content: 'This document is intended for developers interested in document viewing solutions.',
                  subsections: []
                }
              ]
            },
            {
              id: 'section-2',
              title: 'Getting Started',
              level: 1,
              content: 'Let\'s get started with the basics of our document system.',
              subsections: [
                {
                  id: 'section-2-1',
                  title: 'Installation',
                  level: 2,
                  content: 'To install, follow these steps...',
                  subsections: [
                    {
                      id: 'section-2-1-1',
                      title: 'Prerequisites',
                      level: 3,
                      content: 'Before you begin, ensure you have the following...',
                      subsections: []
                    },
                    {
                      id: 'section-2-1-2',
                      title: 'Setup Steps',
                      level: 3,
                      content: 'Follow these steps to complete setup...',
                      subsections: []
                    }
                  ]
                },
                {
                  id: 'section-2-2',
                  title: 'Configuration',
                  level: 2,
                  content: 'Configure your installation with these options...',
                  subsections: []
                }
              ]
            },
            {
              id: 'section-3',
              title: 'Advanced Features',
              level: 1,
              content: 'Explore advanced features of our system.',
              subsections: [
                {
                  id: 'section-3-1',
                  title: 'Customization',
                  level: 2,
                  content: 'Customize your experience with these options...',
                  subsections: []
                },
                {
                  id: 'section-3-2',
                  title: 'Integration',
                  level: 2,
                  content: 'Integrate with other systems using our API...',
                  subsections: []
                }
              ]
            }
          ]
        });
        setActiveSection('section-1');
        setIsLoading(false);
      }, 1000);
    };

    loadDocument();
  }, []);

  // Search functionality
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

  // Find the active section content
  const findSectionById = (sections, id) => {
    if (!sections || !id) return null;
    
    for (const section of sections) {
      if (section.id === id) {
        return section;
      }
      if (section.subsections && section.subsections.length > 0) {
        const found = findSectionById(section.subsections, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Get breadcrumb trail for active section
  const getBreadcrumbs = (sections, targetId, trail = []) => {
    if (!sections || !targetId) return [];
    
    for (const section of sections) {
      if (section.id === targetId) {
        return [...trail, section];
      }
      
      if (section.subsections?.length) {
        const newTrail = [...trail, section];
        const found = getBreadcrumbs(section.subsections, targetId, newTrail);
        if (found.length) return found;
      }
    }
    
    return [];
  };

  // Generate related links based on active section
  const getRelatedLinks = (sectionId) => {
    if (!sectionId) return [];
    
    // In a real app, these would be dynamically generated based on content analysis
    if (sectionId.startsWith('section-1')) {
      return [
        { title: 'Document Structure Overview', url: '#overview' },
        { title: 'Reader Interface Documentation', url: '#interface' },
        { title: 'User Experience Guidelines', url: '#ux' }
      ];
    } else if (sectionId.startsWith('section-2')) {
      return [
        { title: 'Installation Troubleshooting', url: '#troubleshoot' },
        { title: 'System Requirements', url: '#requirements' },
        { title: 'Configuration Examples', url: '#examples' }
      ];
    } else if (sectionId.startsWith('section-3')) {
      return [
        { title: 'Advanced API Documentation', url: '#api' },
        { title: 'Custom Extensions', url: '#extensions' },
        { title: 'Performance Optimization', url: '#performance' }
      ];
    }
    return [];
  };

  // Calculate reading progress
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

  // Navigate to next/prev section
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

  // Handle section click
  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    
    // On mobile, close the drawer after selecting a section
    if (window.innerWidth < 768) {
      setDrawerState('closed');
    }
  };

  // Toggle multi-select filter
  const toggleFilter = (filterSet, setFilterSet, key) => {
    setFilterSet(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Simple drawer state toggle for mobile
  const cycleDrawerState = () => {
    if (drawerState === 'closed') {
      setDrawerState('peek');
    } else if (drawerState === 'peek') {
      setDrawerState('half');
    } else if (drawerState === 'half') {
      setDrawerState('full');
    } else {
      setDrawerState('closed');
    }
  };

  // Toggle drawer state
  const toggleDrawer = () => {
    cycleDrawerState();
  };
  
  // Theme utilities
  const getThemeClasses = () => {
    if (darkMode) {
      return {
        bg: 'bg-gray-900',
        text: 'text-gray-100',
        border: 'border-gray-700',
        panel: 'bg-gray-800',
        highlight: 'bg-blue-900 text-blue-100',
        input: 'bg-gray-800 border-gray-700 text-white',
        button: 'text-gray-300 hover:text-white',
        activeButton: 'bg-blue-900 text-blue-100',
        hoverBg: 'hover:bg-gray-700',
        sectionActive: 'bg-blue-900 text-blue-100 border-blue-500',
        sectionHover: 'hover:bg-gray-800',
        card: 'bg-gray-800 border-gray-700'
      };
    } else {
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-900',
        border: 'border-gray-200',
        panel: 'bg-white',
        highlight: 'bg-blue-100 text-blue-800',
        input: 'bg-white border-gray-300 text-black',
        button: 'text-gray-600 hover:text-gray-900',
        activeButton: 'bg-blue-100 text-blue-700',
        hoverBg: 'hover:bg-gray-100',
        sectionActive: 'bg-blue-50 text-blue-600 border-blue-500',
        sectionHover: 'hover:bg-gray-100',
        card: 'bg-yellow-50 border-yellow-200'
      };
    }
  };

  // Font size classes
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small':
        return 'text-sm';
      case 'medium':
        return 'text-base';
      case 'large':
        return 'text-lg';
      case 'x-large':
        return 'text-xl';
      default:
        return 'text-base';
    }
  };

  const activeContent = activeSection 
    ? findSectionById(docContent?.sections || [], activeSection) 
    : null;
    
  const breadcrumbs = activeSection 
    ? getBreadcrumbs(docContent?.sections || [], activeSection) 
    : [];
    
  const relatedLinks = activeSection 
    ? getRelatedLinks(activeSection) 
    : [];

  const theme = getThemeClasses();

  // Get drawer height based on state
  const getDrawerHeight = () => {
    switch (drawerState) {
      case 'peek':
        return 'h-16';
      case 'half':
        return 'h-1/2';
      case 'full':
        return 'h-5/6';
      default:
        return 'h-12';
    }
  };

  // Value to be provided by context
  const value = {
    // Document state
    docContent,
    activeSection,
    isLoading,
    activeContent,
    breadcrumbs,
    relatedLinks,
    
    // Search state
    searchQuery,
    searchResults,
    
    // UI state
    isTocCollapsed,
    isContextPanelOpen,
    activeTab,
    drawerState,
    activeDrawerContent,
    
    // User preferences
    isLeftHanded,
    darkMode, 
    fontSize,
    showProgress,
    
    // Filters
    tocFilters,
    contentFilters,
    contextFilters,
    
    // Helper functions
    getThemeClasses,
    getFontSizeClass,
    theme,
    getDrawerHeight,
    calculateProgress,
    
    // Actions
    setDocContent,
    setActiveSection,
    setIsLoading,
    setSearchQuery,
    setSearchResults,
    setIsTocCollapsed,
    setIsContextPanelOpen,
    setActiveTab,
    setDrawerState,
    setActiveDrawerContent,
    setIsLeftHanded,
    setDarkMode,
    setFontSize,
    setShowProgress,
    setTocFilters,
    setContentFilters,
    setContextFilters,
    handleSectionClick,
    toggleFilter,
    toggleDrawer,
    navigateSection,
    cycleDrawerState,
    findSectionById,
    getRelatedLinks
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export default DocumentContext;