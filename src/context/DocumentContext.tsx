import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define our interfaces
export interface DocumentSection {
  id: string;
  title: string;
  level: number;
  content: string;
  subsections: DocumentSection[];
  book?: string;
  chapter?: string;
}

export interface DocumentContent {
  title: string;
  sections: DocumentSection[];
}

export interface RelatedLink {
  title: string;
  url: string;
}

export interface TocFilters {
  chapters: boolean;
  sections: boolean;
  subsections: boolean;
}

export interface ContentFilters {
  images: boolean;
  tables: boolean;
  code: boolean;
}

export interface ContextFilters {
  related: boolean;
  references: boolean;
  notes: boolean;
}

export interface ThemeClasses {
  bg: string;
  text: string;
  border: string;
  panel: string;
  highlight: string;
  input: string;
  button: string;
  activeButton: string;
  hoverBg: string;
  sectionActive: string;
  sectionHover: string;
  card: string;
}

export interface DocumentContextProps {
  // Document state
  docContent: DocumentContent;
  activeSection: string | null;
  isLoading: boolean;
  activeContent: DocumentSection | null;
  breadcrumbs: DocumentSection[];
  relatedLinks: RelatedLink[];
  
  // Search state
  searchQuery: string;
  searchResults: DocumentSection[];
  
  // UI state
  isTocCollapsed: boolean;
  isContextPanelOpen: boolean;
  activeTab: string;
  drawerState: 'closed' | 'peek' | 'half' | 'full';
  activeDrawerContent: 'toc' | 'context' | 'settings';
  
  // User preferences
  isLeftHanded: boolean;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'x-large';
  showProgress: boolean;
  
  // Filters
  tocFilters: TocFilters;
  contentFilters: ContentFilters;
  contextFilters: ContextFilters;
  
  // Helper functions
  getThemeClasses: () => ThemeClasses;
  getFontSizeClass: () => string;
  theme: ThemeClasses;
  getDrawerHeight: () => string;
  calculateProgress: () => number;
  
  // Actions
  setDocContent: React.Dispatch<React.SetStateAction<DocumentContent>>;
  setActiveSection: React.Dispatch<React.SetStateAction<string | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setSearchResults: React.Dispatch<React.SetStateAction<DocumentSection[]>>;
  setIsTocCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setIsContextPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  setDrawerState: React.Dispatch<React.SetStateAction<'closed' | 'peek' | 'half' | 'full'>>;
  setActiveDrawerContent: React.Dispatch<React.SetStateAction<'toc' | 'context' | 'settings'>>;
  setIsLeftHanded: React.Dispatch<React.SetStateAction<boolean>>;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  setFontSize: React.Dispatch<React.SetStateAction<'small' | 'medium' | 'large' | 'x-large'>>;
  setShowProgress: React.Dispatch<React.SetStateAction<boolean>>;
  setTocFilters: React.Dispatch<React.SetStateAction<TocFilters>>;
  setContentFilters: React.Dispatch<React.SetStateAction<ContentFilters>>;
  setContextFilters: React.Dispatch<React.SetStateAction<ContextFilters>>;
  handleSectionClick: (sectionId: string) => void;
  toggleFilter: <T extends object>(filterSet: T, setFilterSet: React.Dispatch<React.SetStateAction<T>>, key: keyof T) => void;
  toggleDrawer: () => void;
  navigateSection: (direction: 'next' | 'prev') => void;
  cycleDrawerState: () => void;
  findSectionById: (sections: DocumentSection[] | undefined, id: string | null) => DocumentSection | null;
  getRelatedLinks: (sectionId: string | null) => RelatedLink[];
}

// Create the context
const DocumentContext = createContext<DocumentContextProps | null>(null);

// Custom hook to use the document context
export const useDocumentContext = (): DocumentContextProps => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocumentContext must be used within a DocumentProvider');
  }
  return context;
};

interface DocumentProviderProps {
  children: ReactNode;
}

// Provider component
export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children }) => {
  // Document state
  const [docContent, setDocContent] = useState<DocumentContent>({ 
    title: '', 
    sections: [] 
  });
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<DocumentSection[]>([]);
  
  // UI state
  const [isTocCollapsed, setIsTocCollapsed] = useState<boolean>(false);
  const [isContextPanelOpen, setIsContextPanelOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('document');
  const [drawerState, setDrawerState] = useState<'closed' | 'peek' | 'half' | 'full'>('closed');
  const [activeDrawerContent, setActiveDrawerContent] = useState<'toc' | 'context' | 'settings'>('toc');
  
  // User preferences
  const [isLeftHanded, setIsLeftHanded] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large' | 'x-large'>('medium');
  const [showProgress, setShowProgress] = useState<boolean>(true);
  
  // Filter selection states
  const [tocFilters, setTocFilters] = useState<TocFilters>({
    chapters: true,
    sections: true,
    subsections: true
  });
  
  const [contentFilters, setContentFilters] = useState<ContentFilters>({
    images: true,
    tables: true,
    code: true
  });
  
  const [contextFilters, setContextFilters] = useState<ContextFilters>({
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
              book: 'Book 1',
              chapter: 'Chapter 1',
              content: 'This is the introduction to our document. It contains important information about what you will learn.',
              subsections: [
                {
                  id: 'section-1-1',
                  title: 'Purpose',
                  level: 2,
                  book: 'Book 1',
                  chapter: 'Chapter 1',
                  content: 'The purpose of this document is to demonstrate a React-based document reader.',
                  subsections: []
                },
                {
                  id: 'section-1-2',
                  title: 'Audience',
                  level: 2,
                  book: 'Book 1',
                  chapter: 'Chapter 1',
                  content: 'This document is intended for developers interested in document viewing solutions.',
                  subsections: []
                }
              ]
            },
            {
              id: 'section-2',
              title: 'Getting Started',
              level: 1,
              book: 'Book 1',
              chapter: 'Chapter 2',
              content: 'Let\'s get started with the basics of our document system.',
              subsections: [
                {
                  id: 'section-2-1',
                  title: 'Installation',
                  level: 2,
                  book: 'Book 1',
                  chapter: 'Chapter 2',
                  content: 'To install, follow these steps...',
                  subsections: [
                    {
                      id: 'section-2-1-1',
                      title: 'Prerequisites',
                      level: 3,
                      book: 'Book 1',
                      chapter: 'Chapter 2',
                      content: 'Before you begin, ensure you have the following...',
                      subsections: []
                    },
                    {
                      id: 'section-2-1-2',
                      title: 'Setup Steps',
                      level: 3,
                      book: 'Book 1',
                      chapter: 'Chapter 2',
                      content: 'Follow these steps to complete setup...',
                      subsections: []
                    }
                  ]
                },
                {
                  id: 'section-2-2',
                  title: 'Configuration',
                  level: 2,
                  book: 'Book 1',
                  chapter: 'Chapter 2',
                  content: 'Configure your installation with these options...',
                  subsections: []
                }
              ]
            },
            {
              id: 'section-3',
              title: 'Advanced Features',
              level: 1,
              book: 'Book 2',
              chapter: 'Chapter 1',
              content: 'Explore advanced features of our system.',
              subsections: [
                {
                  id: 'section-3-1',
                  title: 'Customization',
                  level: 2,
                  book: 'Book 2',
                  chapter: 'Chapter 1',
                  content: 'Customize your experience with these options...',
                  subsections: []
                },
                {
                  id: 'section-3-2',
                  title: 'Integration',
                  level: 2,
                  book: 'Book 2',
                  chapter: 'Chapter 1',
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

    const flattenSections = (sections: DocumentSection[], results: DocumentSection[] = []) => {
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
  const findSectionById = (sections: DocumentSection[] | undefined, id: string | null): DocumentSection | null => {
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
  const getBreadcrumbs = (sections: DocumentSection[] | undefined, targetId: string | null, trail: DocumentSection[] = []): DocumentSection[] => {
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
  const getRelatedLinks = (sectionId: string | null): RelatedLink[] => {
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
  const calculateProgress = (): number => {
    if (!activeSection || !docContent.sections) return 0;
    
    const flattenSections = (sections: DocumentSection[], results: DocumentSection[] = []) => {
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
  const navigateSection = (direction: 'next' | 'prev'): void => {
    if (!activeSection || !docContent.sections) return;
    
    const flattenSections = (sections: DocumentSection[], results: DocumentSection[] = []) => {
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
  const handleSectionClick = (sectionId: string): void => {
    setActiveSection(sectionId);
    
    // On mobile, close the drawer after selecting a section
    if (window.innerWidth < 768) {
      setDrawerState('closed');
    }
  };

  // Toggle multi-select filter
  const toggleFilter = <T extends object>(filterSet: T, setFilterSet: React.Dispatch<React.SetStateAction<T>>, key: keyof T): void => {
    setFilterSet(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Simple drawer state toggle for mobile
  const cycleDrawerState = (): void => {
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
  const toggleDrawer = (): void => {
    cycleDrawerState();
  };
  
  // Theme utilities
  const getThemeClasses = (): ThemeClasses => {
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
  const getFontSizeClass = (): string => {
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
  const getDrawerHeight = (): string => {
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
  const value: DocumentContextProps = {
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