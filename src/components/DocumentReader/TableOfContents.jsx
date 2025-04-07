import React, { useState } from 'react';
import { Search, Book, Filter, Bookmark, ChevronRight, Download, Upload } from 'lucide-react';
import { useDocumentContext } from '../../context/DocumentContext';
import SearchResults from './SearchResults';

const TableOfContents = () => {
  const { 
    theme,
    searchQuery, 
    searchResults, 
    activeSection, 
    docContent,
    tocFilters,
    setSearchQuery,
    handleSectionClick,
    toggleFilter,
    setTocFilters,
    navigateSection
  } = useDocumentContext();

  return (
    <>
      {/* TOC Header with Filter Controls */}
      <div className={`p-3 ${theme.border} border-b flex items-center justify-between ${theme.panel === 'bg-white' ? 'bg-gray-50' : theme.panel}`}>
        <h3 className="text-sm font-medium">Contents</h3>
        <div className="flex space-x-1">
          <button 
            className={`p-1.5 rounded ${tocFilters.chapters ? theme.activeButton : `${theme.button} ${theme.hoverBg}`}`}
            onClick={() => toggleFilter(tocFilters, setTocFilters, 'chapters')}
            title="Show chapters"
          >
            <Book size={16} />
          </button>
          <button 
            className={`p-1.5 rounded ${tocFilters.sections ? theme.activeButton : `${theme.button} ${theme.hoverBg}`}`}
            onClick={() => toggleFilter(tocFilters, setTocFilters, 'sections')}
            title="Show sections"
          >
            <Filter size={16} />
          </button>
          <button 
            className={`p-1.5 rounded ${tocFilters.subsections ? theme.activeButton : `${theme.button} ${theme.hoverBg}`}`}
            onClick={() => toggleFilter(tocFilters, setTocFilters, 'subsections')}
            title="Show subsections"
          >
            <Bookmark size={16} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
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

      {/* TOC or Search Results */}
      <div className="flex-1 overflow-y-auto">
        {searchQuery ? (
          <SearchResults />
        ) : (
          <TOCTree />
        )}
      </div>
      
      {/* TOC Footer with Navigation Controls */}
      <div className={`p-3 ${theme.border} border-t flex items-center justify-between ${theme.panel === 'bg-white' ? 'bg-gray-50' : theme.panel}`}>
        <div className="flex space-x-1">
          <button 
            className={`p-1.5 rounded ${theme.button} ${theme.hoverBg}`} 
            title="Previous section"
            onClick={() => navigateSection('prev')}
          >
            <ChevronRight className="transform rotate-180" size={16} />
          </button>
          <button 
            className={`p-1.5 rounded ${theme.button} ${theme.hoverBg}`} 
            title="Next section"
            onClick={() => navigateSection('next')}
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex space-x-1">
          <button className={`p-1.5 rounded ${theme.button} ${theme.hoverBg}`} title="Download">
            <Download size={16} />
          </button>
          <button className={`p-1.5 rounded ${theme.button} ${theme.hoverBg}`} title="Upload">
            <Upload size={16} />
          </button>
        </div>
      </div>
    </>
  );
};

// Tree component for the TOC
const TOCTree = () => {
  const { 
    docContent,
    activeSection,
    handleSectionClick,
    tocFilters,
    theme
  } = useDocumentContext();
  
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
    if ((level === 0 && !tocFilters.chapters) ||
        (level === 1 && !tocFilters.sections) ||
        (level >= 2 && !tocFilters.subsections)) {
      return null;
    }
    
    return sections.map(section => {
      const hasSubsections = section.subsections && section.subsections.length > 0;
      const isExpanded = expandedSections[section.id] !== false; // Default to expanded
      
      return (
        <div key={section.id} className="relative">
          <div
            className={`flex items-center px-4 py-2 text-sm cursor-pointer ${theme.sectionHover} ${
              activeSection === section.id ? `${theme.sectionActive} font-medium border-l-4` : ''
            }`}
            style={{ paddingLeft: `${(level + 1) * 16}px` }}
          >
            {hasSubsections && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSection(section.id);
                }}
                className="mr-1 w-5 h-5 flex items-center justify-center text-gray-500 dark:text-gray-400"
              >
                {isExpanded ? '−' : '+'}
              </button>
            )}
            <span
              onClick={() => handleSectionClick(section.id)}
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
      {renderSections(docContent.sections)}
    </div>
  );
};

export default TableOfContents;