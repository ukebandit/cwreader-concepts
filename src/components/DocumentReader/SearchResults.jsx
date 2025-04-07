import React from 'react';
import { useDocumentContext } from '../../context/DocumentContext';

const SearchResults = () => {
  const { 
    searchResults, 
    activeSection,
    handleSectionClick,
    theme
  } = useDocumentContext();

  if (!searchResults || searchResults.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        No results found
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Search Results ({searchResults.length})
      </div>
      {searchResults.map(section => (
        <div
          key={section.id}
          className={`px-4 py-2 text-sm cursor-pointer ${theme.sectionHover} ${
            activeSection === section.id ? `${theme.sectionActive} font-medium border-l-4` : ''
          }`}
          onClick={() => handleSectionClick(section.id)}
        >
          <div className="font-medium">{section.title}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{section.content}</div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;