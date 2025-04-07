import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, Bookmark, Share, Info, Home, ChevronRight, Settings, Book, Filter, Download, Upload, Heart, Star, ChevronUp, Smartphone, X } from 'lucide-react';

// Main App Component
const DocumentReader = () => {
  // Initialize with empty arrays to prevent mapping issues
  const [docContent, setDocContent] = useState({ 
    title: '', 
    sections: [] 
  });
  const [activeSection, setActiveSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTocCollapsed, setIsTocCollapsed] = useState(false); // Set to false for desktop view
  const [isContextPanelOpen, setIsContextPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('document');
  const [drawerState, setDrawerState] = useState('closed'); // closed, peek, half, full
  const [isLeftHanded, setIsLeftHanded] = useState(false);
  const [activeDrawerContent, setActiveDrawerContent] = useState('toc'); // toc, context, settings
  const contentRef = useRef(null);
  const drawerRef = useRef(null);

  // Filter selection states (for multi-select controls)
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

  // React-friendly drawer handling without document event listeners
  const handleDrawerHandleTouch = () => {
    toggleDrawer();
  };
  
  // Simple drawer state toggle without direct DOM manipulation
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

    const results = flattenSections(docContent.sections);
    setSearchResults(results);
  }, [searchQuery, docContent.sections]);

  // Handle section click
  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    
    // In a real implementation, you might scroll to the section
    if (contentRef.current) {
      const element = contentRef.current.querySelector(`#content-${sectionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    // On mobile, close the drawer after selecting a section
    if (window.innerWidth < 768) {
      setDrawerState('closed');
    }
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
        if (found) return found;
      }
    }
    
    return [];
  };

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

  const activeContent = activeSection 
    ? findSectionById(docContent?.sections || [], activeSection) 
    : null;
    
  const breadcrumbs = activeSection 
    ? getBreadcrumbs(docContent?.sections || [], activeSection, []) 
    : [];
    
  const relatedLinks = activeSection 
    ? getRelatedLinks(activeSection) 
    : [];

  // Toggle multi-select filter
  const toggleFilter = (filterSet, setFilterSet, key) => {
    setFilterSet(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

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

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Nav (Hamburger & Tabs) */}
      <header className="bg-white shadow-sm border-b h-12 flex items-center px-4 z-10">
        <button 
          className="mr-4 text-gray-600 hover:text-gray-900 md:flex hidden"
          onClick={() => setIsTocCollapsed(!isTocCollapsed)}
        >
          <Menu size={20} />
        </button>
        
        <div className="md:flex hidden space-x-2 text-sm">
          <button 
            className={`px-3 py-1 rounded-md ${activeTab === 'document' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('document')}
          >
            Document
          </button>
          <button 
            className={`px-3 py-1 rounded-md ${activeTab === 'bookmarks' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('bookmarks')}
          >
            Bookmarks
          </button>
          <button 
            className={`px-3 py-1 rounded-md ${activeTab === 'notes' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('notes')}
          >
            Notes
          </button>
        </div>
        
        {/* Mobile title */}
        <div className="md:hidden flex-1 text-center font-medium truncate">
          {docContent.title}
        </div>
        
        <div className="ml-auto flex items-center space-x-2">
          {/* Mobile buttons */}
          <button 
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => {
              setActiveDrawerContent('toc');
              setDrawerState(drawerState === 'closed' ? 'peek' : 'closed');
            }}
          >
            <Menu size={20} />
          </button>
          
          {/* Desktop buttons */}
          <button 
            className="md:flex hidden text-gray-600 hover:text-gray-900"
            onClick={() => setIsContextPanelOpen(!isContextPanelOpen)}
          >
            <Info size={18} />
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <Share size={18} />
          </button>
          <button 
            className="text-gray-600 hover:text-gray-900"
            onClick={() => {
              if (window.innerWidth < 768) {
                setActiveDrawerContent('settings');
                setDrawerState(drawerState === 'closed' ? 'half' : 'closed');
              }
            }}
          >
            <Settings size={18} />
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* TOC Pane (desktop) */}
        <aside className={`bg-white border-r flex flex-col transition-all duration-300 md:static absolute inset-y-0 left-0 z-20
          ${isTocCollapsed ? 'w-0 opacity-0 md:w-64 md:opacity-100' : 'md:w-64 md:opacity-100'} 
          hidden md:flex`}>
          {/* TOC Header with Filter Controls */}
          <div className="p-3 border-b flex items-center justify-between bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700">Contents</h3>
            <div className="flex space-x-1">
              <button 
                className={`p-1.5 rounded ${tocFilters.chapters ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                onClick={() => toggleFilter(tocFilters, setTocFilters, 'chapters')}
                title="Show chapters"
              >
                <Book size={16} />
              </button>
              <button 
                className={`p-1.5 rounded ${tocFilters.sections ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                onClick={() => toggleFilter(tocFilters, setTocFilters, 'sections')}
                title="Show sections"
              >
                <Filter size={16} />
              </button>
              <button 
                className={`p-1.5 rounded ${tocFilters.subsections ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                onClick={() => toggleFilter(tocFilters, setTocFilters, 'subsections')}
                title="Show subsections"
              >
                <Bookmark size={16} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-3 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
          </div>

          {/* TOC or Search Results */}
          <div className="flex-1 overflow-y-auto">
            {searchQuery ? (
              <SearchResults 
                results={searchResults} 
                activeSection={activeSection}
                onSectionClick={handleSectionClick}
              />
            ) : (
              <TableOfContents 
                sections={docContent?.sections || []} 
                activeSection={activeSection}
                onSectionClick={handleSectionClick}
                filters={tocFilters}
              />
            )}
          </div>
          
          {/* TOC Footer with Navigation Controls */}
          <div className="p-3 border-t flex items-center justify-between bg-gray-50">
            <div className="flex space-x-1">
              <button className="p-1.5 rounded text-gray-500 hover:bg-gray-100" title="Previous section">
                <ChevronRight className="transform rotate-180" size={16} />
              </button>
              <button className="p-1.5 rounded text-gray-500 hover:bg-gray-100" title="Next section">
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="flex space-x-1">
              <button className="p-1.5 rounded text-gray-500 hover:bg-gray-100" title="Download">
                <Download size={16} />
              </button>
              <button className="p-1.5 rounded text-gray-500 hover:bg-gray-100" title="Upload">
                <Upload size={16} />
              </button>
            </div>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 flex flex-col overflow-hidden">
            {/* Breadcrumbs */}
            <div className="bg-white border-b px-6 py-2 flex items-center space-x-1 h-10 text-sm overflow-x-auto whitespace-nowrap">
              <button className="text-gray-500 hover:text-gray-700 min-w-6">
                <Home size={14} />
              </button>
              {breadcrumbs && breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.id}>
                  <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
                  <button 
                    className={`hover:text-gray-700 ${index === breadcrumbs.length - 1 ? 'font-medium text-gray-800' : 'text-gray-500'} truncate max-w-xs`}
                    onClick={() => handleSectionClick(crumb.id)}
                  >
                    {crumb.title}
                  </button>
                </React.Fragment>
              ))}
            </div>
          
          {/* Content Area */}
          <div 
            ref={contentRef}
            className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6" // Extra padding for mobile drawer
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : activeContent ? (
              <div>
                <h2 id={`content-${activeContent.id}`} className="text-2xl font-bold mb-4">{activeContent.title}</h2>
                <div className="prose max-w-none">{activeContent.content}</div>
              </div>
            ) : (
              <div className="flex-1 text-center text-gray-500 mt-10">
                Select a section from the table of contents
              </div>
            )}
          </div>
          
          {/* Content Footer */}
          <div className="bg-white border-t px-6 py-2 flex items-center justify-between h-10 md:static fixed bottom-0 left-0 right-0 z-10">
            <div className="flex space-x-2 text-sm">
              <button className="text-gray-500 hover:text-gray-700 flex items-center space-x-1">
                <Star size={14} />
                <span className="md:inline hidden">Favorite</span>
              </button>
              <button className="text-gray-500 hover:text-gray-700 flex items-center space-x-1">
                <Bookmark size={14} />
                <span className="md:inline hidden">Bookmark</span>
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Page 1 of {docContent.sections.length}
            </div>
          </div>
        </main>
        
        {/* Right Context Panel (desktop) */}
        <aside className={`bg-white border-l flex flex-col transition-all duration-300 md:static absolute inset-y-0 right-0 z-20
          ${isContextPanelOpen ? 'md:w-64 md:opacity-100' : 'md:w-0 md:opacity-0'} 
          hidden md:flex`}>
          {/* Context Panel Header */}
          <div className="p-3 border-b flex items-center justify-between bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700">Related</h3>
            <div className="flex space-x-1">
              <button 
                className={`p-1.5 rounded ${contextFilters.related ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                onClick={() => toggleFilter(contextFilters, setContextFilters, 'related')}
                title="Show related links"
              >
                <Share size={16} />
              </button>
              <button 
                className={`p-1.5 rounded ${contextFilters.references ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                onClick={() => toggleFilter(contextFilters, setContextFilters, 'references')}
                title="Show references"
              >
                <Info size={16} />
              </button>
              <button 
                className={`p-1.5 rounded ${contextFilters.notes ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                onClick={() => toggleFilter(contextFilters, setContextFilters, 'notes')}
                title="Show notes"
              >
                <Bookmark size={16} />
              </button>
            </div>
          </div>
          
          {/* Related Links */}
          <div className="flex-1 overflow-y-auto p-3">
            {contextFilters.related && (
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Related Content
                </h4>
                <ul className="space-y-2">
                  {relatedLinks.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.url} 
                        className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {contextFilters.references && (
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  References
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#ref1" className="block text-sm text-blue-600 hover:text-blue-800 hover:underline">
                      Document Design Patterns
                    </a>
                  </li>
                  <li>
                    <a href="#ref2" className="block text-sm text-blue-600 hover:text-blue-800 hover:underline">
                      Web Content Accessibility Guidelines
                    </a>
                  </li>
                  <li>
                    <a href="#ref3" className="block text-sm text-blue-600 hover:text-blue-800 hover:underline">
                      React Patterns for Document Systems
                    </a>
                  </li>
                </ul>
              </div>
            )}
            
            {contextFilters.notes && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Notes
                </h4>
                <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 text-sm text-gray-700">
                  This section provides an overview of the document system's architecture. The integration section contains specific implementation details.
                </div>
              </div>
            )}
          </div>
          
          {/* Context Panel Footer */}
          <div className="p-3 border-t flex items-center justify-between bg-gray-50">
            <div className="flex space-x-1">
              <button 
                className={`p-1.5 rounded ${contentFilters.images ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                onClick={() => toggleFilter(contentFilters, setContentFilters, 'images')}
                title="Show images"
              >
                <Filter size={16} />
              </button>
              <button 
                className={`p-1.5 rounded ${contentFilters.tables ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                onClick={() => toggleFilter(contentFilters, setContentFilters, 'tables')}
                title="Show tables"
              >
                <Filter size={16} />
              </button>
              <button 
                className={`p-1.5 rounded ${contentFilters.code ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                onClick={() => toggleFilter(contentFilters, setContentFilters, 'code')}
                title="Show code"
              >
                <Filter size={16} />
              </button>
            </div>
            <button className="p-1.5 rounded text-gray-500 hover:bg-gray-100" title="Favorite">
              <Heart size={16} />
            </button>
          </div>
        </aside>
        
        {/* Mobile Drawer (slides up from bottom) */}
        <div 
          ref={drawerRef}
          className={`fixed inset-x-0 bottom-0 bg-white shadow-lg rounded-t-xl 
            md:hidden z-30 transition-all duration-300 transform
            ${drawerState === 'closed' ? 'translate-y-full' : 'translate-y-0'} ${getDrawerHeight()}`}
        >
          {/* Drawer Handle */}
          <div 
            className="drawer-handle h-6 w-full flex items-center justify-center cursor-pointer"
            onClick={handleDrawerHandleTouch}
          >
            <div className="h-1 w-16 bg-gray-300 rounded-full"></div>
          </div>
          
          {/* Close button */}
          <button 
            className="absolute top-2 right-3 text-gray-500 p-1"
            onClick={() => setDrawerState('closed')}
          >
            <X size={18} />
          </button>
          
          {/* Drawer Content */}
          <div className="p-3 overflow-y-auto" style={{ height: 'calc(100% - 24px)' }}>
            {/* Navigation tabs */}
            <div className="flex border-b mb-3">
              <button 
                className={`flex-1 py-2 text-sm font-medium ${activeDrawerContent === 'toc' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveDrawerContent('toc')}
              >
                Contents
              </button>
              <button 
                className={`flex-1 py-2 text-sm font-medium ${activeDrawerContent === 'context' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveDrawerContent('context')}
              >
                Related
              </button>
              <button 
                className={`flex-1 py-2 text-sm font-medium ${activeDrawerContent === 'settings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveDrawerContent('settings')}
              >
                Settings
              </button>
            </div>
            
            {/* TOC Content */}
            {activeDrawerContent === 'toc' && (
              <>
                {/* Mobile Search */}
                <div className="mb-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  </div>
                </div>
                
                {/* Mobile TOC */}
                {searchQuery ? (
                  <SearchResults 
                    results={searchResults} 
                    activeSection={activeSection}
                    onSectionClick={handleSectionClick}
                  />
                ) : (
                  <TableOfContents 
                    sections={docContent?.sections || []} 
                    activeSection={activeSection}
                    onSectionClick={handleSectionClick}
                    filters={tocFilters}
                  />
                )}
              </>
            )}
            
            {/* Context Content */}
            {activeDrawerContent === 'context' && (
              <div>
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Related Content
                  </h4>
                  <ul className="space-y-2">
                    {relatedLinks && relatedLinks.length > 0 ? relatedLinks.map((link, index) => (
                      <li key={index}>
                        <a 
                          href={link.url} 
                          className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {link.title}
                        </a>
                      </li>
                    )) : (
                      <li className="text-sm text-gray-500">No related content found</li>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Notes
                  </h4>
                  <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 text-sm text-gray-700">
                    This section provides an overview of the document system's architecture. The integration section contains specific implementation details.
                  </div>
                </div>
              </div>
            )}
            
            {/* Settings Content */}
            {activeDrawerContent === 'settings' && (
              <div>
                <h3 className="font-medium mb-4">Display Options</h3>
                
                {/* Handedness preference */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Controls Position</h4>
                  <div className="flex space-x-3">
                    <button 
                      className={`flex-1 py-2 px-3 border rounded-md ${!isLeftHanded ? 'bg-blue-50 border-blue-200 text-blue-700' : 'text-gray-700'}`}
                      onClick={() => setIsLeftHanded(false)}
                    >
                      Right-handed
                    </button>
                    <button 
                      className={`flex-1 py-2 px-3 border rounded-md ${isLeftHanded ? 'bg-blue-50 border-blue-200 text-blue-700' : 'text-gray-700'}`}
                      onClick={() => setIsLeftHanded(true)}
                    >
                      Left-handed
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Positions the mobile drawer controls for easier one-handed use
                  </p>
                </div>
                
                {/* Content filters */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Content Display</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={contentFilters.images} 
                        onChange={() => toggleFilter(contentFilters, setContentFilters, 'images')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Show images</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={contentFilters.tables} 
                        onChange={() => toggleFilter(contentFilters, setContentFilters, 'tables')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Show tables</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={contentFilters.code} 
                        onChange={() => toggleFilter(contentFilters, setContentFilters, 'code')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Show code blocks</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile FAB for thumb control - position based on handedness */}
          <div className={`absolute ${isLeftHanded ? 'left-4' : 'right-4'} bottom-20 z-50 md:hidden`}>
            <div className="flex flex-col space-y-3">
              <button 
                className="h-12 w-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center"
                onClick={() => {
                  setActiveDrawerContent('toc');
                  setDrawerState(drawerState === 'closed' ? 'peek' : 'closed');
                }}
              >
                <Menu size={20} />
              </button>
              {drawerState !== 'closed' && (
                <>
                  <button 
                    className={`h-10 w-10 rounded-full ${activeDrawerContent === 'context' ? 'bg-blue-600' : 'bg-gray-200'} text-white shadow-lg flex items-center justify-center`}
                    onClick={() => {
                      setActiveDrawerContent('context');
                      if (drawerState === 'closed') setDrawerState('peek');
                    }}
                  >
                    <Info size={18} />
                  </button>
                  <button 
                    className={`h-10 w-10 rounded-full ${activeDrawerContent === 'settings' ? 'bg-blue-600' : 'bg-gray-200'} text-white shadow-lg flex items-center justify-center`}
                    onClick={() => {
                      setActiveDrawerContent('settings');
                      if (drawerState === 'closed') setDrawerState('peek');
                    }}
                  >
                    <Settings size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// TableOfContents Component
const TableOfContents = ({ sections = [], activeSection, onSectionClick, filters }) => {
  const [expandedSections, setExpandedSections] = useState({});

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const renderSections = (sections, level = 0) => {
    // Ensure sections exists and is an array
    if (!sections || !Array.isArray(sections) || sections.length === 0) {
      return null;
    }
    
    // Filter sections based on level
    if ((level === 0 && !filters.chapters) ||
        (level === 1 && !filters.sections) ||
        (level >= 2 && !filters.subsections)) {
      return null;
    }
    
    return sections.map(section => {
      const hasSubsections = section.subsections && section.subsections.length > 0;
      const isExpanded = expandedSections[section.id] !== false; // Default to expanded
      
      return (
        <div key={section.id} className="relative">
          <div
            className={`flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
              activeSection === section.id ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-500' : ''
            }`}
            style={{ paddingLeft: `${(level + 1) * 16}px` }}
          >
            {hasSubsections && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSection(section.id);
                }}
                className="mr-1 w-5 h-5 flex items-center justify-center text-gray-500"
              >
                {isExpanded ? '−' : '+'}
              </button>
            )}
            <span
              onClick={() => onSectionClick(section.id)}
              className="flex-1 truncate"
            >
              {section.title}
            </span>
          </div>
          
          {hasSubsections && isExpanded && (
            <div className="ml-2">
              {renderSections(section.subsections, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="py-2">
      {renderSections(sections)}
    </div>
  );
};

// SearchResults Component
const SearchResults = ({ results = [], activeSection, onSectionClick }) => {
  if (!results || results.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No results found
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Search Results ({results.length})
      </div>
      {results.map(section => (
        <div
          key={section.id}
          className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
            activeSection === section.id ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-500' : ''
          }`}
          onClick={() => onSectionClick(section.id)}
        >
          <div className="font-medium">{section.title}</div>
          <div className="text-xs text-gray-500 truncate">{section.content}</div>
        </div>
      ))}
    </div>
  );
};

export default DocumentReader;