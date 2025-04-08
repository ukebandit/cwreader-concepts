import React, { useState, useRef } from 'react';
import { Search, Menu, Bookmark, Share, Info, Home, ChevronRight, Settings, 
         Book, Filter, Download, Upload, Heart, Star, X, Moon, Sun, Eye, EyeOff } from 'lucide-react';
import ShareSheet from './DocumentReader/ShareSheet';
import TableOfContents from './DocumentReader/TableOfContents';
import SearchResults from './DocumentReader/SearchResults';
import { useDocumentContext } from '../context/DocumentContext';
import { DocumentSection } from '../context/DocumentContext';

const DocumentReader: React.FC = () => {
  const {
    docContent,
    activeSection,
    searchQuery,
    searchResults,
    isLoading,
    isTocCollapsed,
    isContextPanelOpen,
    activeTab,
    drawerState,
    isLeftHanded,
    activeDrawerContent,
    darkMode,
    fontSize,
    showProgress,
    tocFilters,
    contentFilters,
    contextFilters,
    theme,
    getFontSizeClass,
    getDrawerHeight,
    calculateProgress,
    relatedLinks,
    breadcrumbs,
    activeContent,
    setSearchQuery,
    setIsTocCollapsed,
    setActiveTab,
    setDrawerState,
    setActiveDrawerContent,
    setDarkMode,
    setFontSize,
    setShowProgress,
    toggleFilter,
    handleSectionClick,
    navigateSection,
    setIsContextPanelOpen,
    setContentFilters,
    setContextFilters,
    setTocFilters,
    setIsLeftHanded
  } = useDocumentContext();

  // ShareSheet state
  const [isShareSheetOpen, setIsShareSheetOpen] = useState<boolean>(false);
  const [shareSection, setShareSection] = useState<DocumentSection | null>(null);

  // Refs
  const contentRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // React-friendly drawer handling without document event listeners
  const handleDrawerHandleTouch = () => {
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

  return (
    <div className={`flex flex-col h-screen ${theme.bg} ${theme.text} transition-colors duration-300`}>
      {/* Top Nav (Hamburger & Tabs) */}
      <header className={`${theme.panel} shadow-sm ${theme.border} border-b h-12 flex items-center px-4 z-10`}>
        <button 
          className={`mr-4 ${theme.button} md:flex hidden`}
          onClick={() => setIsTocCollapsed(!isTocCollapsed)}
        >
          <Menu size={20} />
        </button>
        
        {/* Navigation tabs */}
        <div className="md:flex hidden space-x-2 text-sm">
          <button 
            className={`px-3 py-1 rounded-md ${activeTab === 'document' ? theme.highlight : `${theme.button} ${theme.hoverBg}`}`}
            onClick={() => setActiveTab('document')}
          >
            Document
          </button>
          <button 
            className={`px-3 py-1 rounded-md ${activeTab === 'bookmarks' ? theme.highlight : `${theme.button} ${theme.hoverBg}`}`}
            onClick={() => setActiveTab('bookmarks')}
          >
            Bookmarks
          </button>
          <button 
            className={`px-3 py-1 rounded-md ${activeTab === 'notes' ? theme.highlight : `${theme.button} ${theme.hoverBg}`}`}
            onClick={() => setActiveTab('notes')}
          >
            Notes
          </button>
        </div>
        
        {/* Mobile title */}
        <div className="md:hidden flex-1 text-center font-medium truncate">
          {docContent.title}
        </div>
        
        {/* Right buttons */}
        <div className="ml-auto flex items-center space-x-3">
          <button 
            className={`${theme.button}`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button 
            className={`md:hidden ${theme.button}`}
            onClick={() => {
              setActiveDrawerContent('toc');
              setDrawerState(drawerState === 'closed' ? 'peek' : 'closed');
            }}
          >
            <Menu size={20} />
          </button>
          
          <button 
            className={`md:flex hidden ${theme.button}`}
            onClick={() => setIsContextPanelOpen(!isContextPanelOpen)}
          >
            <Info size={18} />
          </button>
          
          <button 
            className={`${theme.button}`}
            onClick={() => {
              if (activeContent) {
                setShareSection(activeContent);
                setIsShareSheetOpen(true);
              }
            }}
          >
            <Share size={18} />
          </button>
          
          <button 
            className={`${theme.button}`}
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
      
      {/* Reading Progress Bar */}
      {showProgress && activeSection && (
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <div 
            className="h-1 bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* TOC Pane (desktop) */}
        <aside className={`${theme.panel} ${theme.border} border-r flex flex-col transition-all duration-300 md:static absolute inset-y-0 left-0 z-20
          ${isTocCollapsed ? 'md:w-0 md:opacity-0' : 'md:w-64 md:opacity-100'} 
          hidden md:flex`}>
          {/* Filter buttons */}
          <div className={`p-3 ${theme.border} border-b flex items-center justify-between ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <h3 className="text-sm font-medium">Contents</h3>
            <div className="flex space-x-1">
              <button 
                className={`p-1.5 rounded ${tocFilters.chapters ? theme.activeButton : `${theme.button} ${theme.hoverBg}`}`}
                onClick={() => toggleFilter(tocFilters, setTocFilters, 'chapters')}
              >
                <Book size={16} />
              </button>
              <button 
                className={`p-1.5 rounded ${tocFilters.sections ? theme.activeButton : `${theme.button} ${theme.hoverBg}`}`}
                onClick={() => toggleFilter(tocFilters, setTocFilters, 'sections')}
              >
                <Filter size={16} />
              </button>
              <button 
                className={`p-1.5 rounded ${tocFilters.subsections ? theme.activeButton : `${theme.button} ${theme.hoverBg}`}`}
                onClick={() => toggleFilter(tocFilters, setTocFilters, 'subsections')}
              >
                <Bookmark size={16} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className={`p-3 ${theme.border} border-b`}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className={`w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
          </div>

          {/* Contents */}
          <div className="flex-1 overflow-y-auto">
            {searchQuery ? (
              <SearchResults 
                results={searchResults} 
                activeSection={activeSection}
                onSectionClick={handleSectionClick}
                theme={theme}
              />
            ) : (
              <TableOfContents 
                sections={docContent.sections} 
                activeSection={activeSection}
                onSectionClick={handleSectionClick}
                filters={tocFilters}
                theme={theme}
              />
            )}
          </div>
          
          {/* Navigation Controls */}
          <div className={`p-3 ${theme.border} border-t flex items-center justify-between ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex space-x-1">
              <button 
                className={`p-1.5 rounded ${theme.button} ${theme.hoverBg}`} 
                onClick={() => navigateSection('prev')}
              >
                <ChevronRight className="transform rotate-180" size={16} />
              </button>
              <button 
                className={`p-1.5 rounded ${theme.button} ${theme.hoverBg}`} 
                onClick={() => navigateSection('next')}
              >
                <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="flex space-x-1">
              <button className={`p-1.5 rounded ${theme.button} ${theme.hoverBg}`}>
                <Download size={16} />
              </button>
              <button className={`p-1.5 rounded ${theme.button} ${theme.hoverBg}`}>
                <Upload size={16} />
              </button>
            </div>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Breadcrumbs */}
          <div className={`${theme.panel} ${theme.border} border-b px-6 py-2 flex items-center space-x-1 h-10 text-sm overflow-x-auto whitespace-nowrap`}>
            <button className={`${theme.button} min-w-6`}>
              <Home size={14} />
            </button>
            {breadcrumbs.length > 0 && breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.id}>
                <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
                <button 
                  className={`hover:text-gray-700 dark:hover:text-gray-300 ${index === breadcrumbs.length - 1 ? 'font-medium text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'} truncate max-w-xs`}
                  onClick={() => handleSectionClick(crumb.id)}
                >
                  {crumb.title}
                </button>
              </React.Fragment>
            ))}
          </div>
        
          {/* Content */}
          <div 
            ref={contentRef}
            className={`flex-1 overflow-y-auto p-6 pb-24 md:pb-6 ${getFontSizeClass()}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : activeContent ? (
              <div>
                <h2 id={`content-${activeContent.id}`} className="text-2xl font-bold mb-4">{activeContent.title}</h2>
                <div className={`prose dark:prose-invert max-w-none`}>{activeContent.content}</div>
              </div>
            ) : (
              <div className="flex-1 text-center text-gray-500 dark:text-gray-400 mt-10">
                Select a section from the table of contents
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className={`${theme.panel} ${theme.border} border-t px-6 py-2 flex items-center justify-between h-10 md:static fixed bottom-0 left-0 right-0 z-10`}>
            <div className="flex space-x-4 text-sm">
              <button className={`${theme.button} flex items-center space-x-1`}>
                <Star size={14} />
                <span className="md:inline hidden">Favorite</span>
              </button>
              <button className={`${theme.button} flex items-center space-x-1`}>
                <Bookmark size={14} />
                <span className="md:inline hidden">Bookmark</span>
              </button>
              <button
                className={`${theme.button} flex items-center space-x-1`}
                onClick={() => setShowProgress(!showProgress)}
              >
                {showProgress ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Font size controls */}
              <div className="flex items-center space-x-1">
                <button className={`${theme.button} p-1`} onClick={() => setFontSize('small')}>
                  <span className="text-xs">A</span>
                </button>
                <button className={`${theme.button} p-1`} onClick={() => setFontSize('medium')}>
                  <span className="text-sm">A</span>
                </button>
                <button className={`${theme.button} p-1`} onClick={() => setFontSize('large')}>
                  <span className="text-base">A</span>
                </button>
                <button className={`${theme.button} p-1`} onClick={() => setFontSize('x-large')}>
                  <span className="text-lg">A</span>
                </button>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {calculateProgress()}%
              </div>
            </div>
          </div>
        </main>
        
        {/* Right Context Panel */}
        <aside className={`${theme.panel} ${theme.border} border-l flex flex-col transition-all duration-300 md:static absolute inset-y-0 right-0 z-20
          ${isContextPanelOpen ? 'md:w-64 md:opacity-100' : 'md:w-0 md:opacity-0'} 
          hidden md:flex`}>
          {/* Headers */}
          <div className={`p-3 ${theme.border} border-b flex items-center justify-between ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <h3 className="text-sm font-medium">Related</h3>
            <div className="flex space-x-1">
              <button className={`p-1.5 rounded ${contextFilters.related ? theme.activeButton : `${theme.button} ${theme.hoverBg}`}`} onClick={() => toggleFilter(contextFilters, setContextFilters, 'related')}>
                <Share size={16} />
              </button>
              <button className={`p-1.5 rounded ${contextFilters.references ? theme.activeButton : `${theme.button} ${theme.hoverBg}`}`} onClick={() => toggleFilter(contextFilters, setContextFilters, 'references')}>
                <Info size={16} />
              </button>
              <button className={`p-1.5 rounded ${contextFilters.notes ? theme.activeButton : `${theme.button} ${theme.hoverBg}`}`} onClick={() => toggleFilter(contextFilters, setContextFilters, 'notes')}>
                <Bookmark size={16} />
              </button>
            </div>
          </div>
          
          {/* Related content */}
          <div className="flex-1 overflow-y-auto p-3">
            {contextFilters.related && (
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Related Content
                </h4>
                <ul className="space-y-2">
                  {relatedLinks.length > 0 ? relatedLinks.map((link, index) => (
                    <li key={index}>
                      <a href={link.url} className="block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline">
                        {link.title}
                      </a>
                    </li>
                  )) : (
                    <li className="text-sm text-gray-500 dark:text-gray-400">No related content for this section</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </aside>
        
        {/* Mobile drawer */}
        <div 
          ref={drawerRef}
          className={`fixed inset-x-0 bottom-0 ${theme.panel} shadow-lg rounded-t-xl 
            md:hidden z-30 transition-all duration-300 transform
            ${drawerState === 'closed' ? 'translate-y-full' : 'translate-y-0'} ${getDrawerHeight()}`}
        >
          {/* Handle */}
          <div className="h-6 w-full flex items-center justify-center cursor-pointer" onClick={handleDrawerHandleTouch}>
            <div className="h-1 w-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          </div>
          
          {/* Close button */}
          <button className={`absolute top-2 right-3 ${theme.button} p-1`} onClick={() => setDrawerState('closed')}>
            <X size={18} />
          </button>
          
          {/* Content */}
          <div className="p-3 overflow-y-auto" style={{ height: 'calc(100% - 24px)' }}>
            {/* Tabs */}
            <div className={`flex ${theme.border} border-b mb-3`}>
              <button className={`flex-1 py-2 text-sm font-medium ${activeDrawerContent === 'toc' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`} onClick={() => setActiveDrawerContent('toc')}>
                Contents
              </button>
              <button className={`flex-1 py-2 text-sm font-medium ${activeDrawerContent === 'context' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`} onClick={() => setActiveDrawerContent('context')}>
                Related
              </button>
              <button className={`flex-1 py-2 text-sm font-medium ${activeDrawerContent === 'settings' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`} onClick={() => setActiveDrawerContent('settings')}>
                Settings
              </button>
            </div>
            
            {/* Tab contents */}
            {activeDrawerContent === 'toc' && (
              <>
                <div className="mb-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className={`w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  </div>
                </div>
                
                {searchQuery ? (
                  <SearchResults 
                    results={searchResults} 
                    activeSection={activeSection}
                    onSectionClick={handleSectionClick}
                    theme={theme}
                  />
                ) : (
                  <TableOfContents 
                    sections={docContent.sections} 
                    activeSection={activeSection}
                    onSectionClick={handleSectionClick}
                    filters={tocFilters}
                    theme={theme}
                  />
                )}
              </>
            )}
            
            {activeDrawerContent === 'settings' && (
              <div>
                <h3 className="font-medium mb-4">Display Options</h3>
                
                {/* Theme toggle */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Theme</h4>
                  <div className="flex space-x-3">
                    <button className={`flex-1 py-2 px-3 border rounded-md ${!darkMode ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`} onClick={() => setDarkMode(false)}>
                      Light
                    </button>
                    <button className={`flex-1 py-2 px-3 border rounded-md ${darkMode ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`} onClick={() => setDarkMode(true)}>
                      Dark
                    </button>
                  </div>
                </div>
                
                {/* Handedness */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Controls Position</h4>
                  <div className="flex space-x-3">
                    <button className={`flex-1 py-2 px-3 border rounded-md ${!isLeftHanded ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`} onClick={() => setIsLeftHanded(false)}>
                      Right-handed
                    </button>
                    <button className={`flex-1 py-2 px-3 border rounded-md ${isLeftHanded ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`} onClick={() => setIsLeftHanded(true)}>
                      Left-handed
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* ShareSheet */}
      <ShareSheet
        isOpen={isShareSheetOpen}
        onClose={() => setIsShareSheetOpen(false)}
        section={shareSection}
      />
    </div>
  );
};

export default DocumentReader;