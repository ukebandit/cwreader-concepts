import React from 'react';
import { DocumentSection, ThemeClasses } from '../../context/DocumentContext';

interface SearchResultsProps {
  results: DocumentSection[];
  activeSection: string | null;
  onSectionClick: (sectionId: string) => void;
  theme: ThemeClasses;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results = [], 
  activeSection, 
  onSectionClick, 
  theme 
}) => {
  if (!results || results.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        No results found
      </div>
    );
  }

  // Group results by book and chapter
  const groupResults = () => {
    const grouped: Record<string, Record<string, DocumentSection[]>> = {};
    
    results.forEach(section => {
      const book = section.book || 'Uncategorized';
      const chapter = section.chapter || 'General';
      
      if (!grouped[book]) {
        grouped[book] = {};
      }
      
      if (!grouped[book][chapter]) {
        grouped[book][chapter] = [];
      }
      
      grouped[book][chapter].push(section);
    });
    
    return grouped;
  };
  
  const groupedResults = groupResults();
  const hasGroupedResults = Object.keys(groupedResults).length > 0;

  return (
    <div className="py-2">
      <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Search Results ({results.length})
      </div>
      
      {hasGroupedResults ? (
        // Grouped results by book and chapter
        Object.entries(groupedResults).map(([book, chapters]) => (
          <div key={book} className="mb-4">
            <div className="px-4 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
              {book}
            </div>
            
            {Object.entries(chapters).map(([chapter, sections]) => (
              <div key={`${book}-${chapter}`} className="pl-2">
                <div className="px-4 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                  {chapter}
                </div>
                
                {sections.map(section => (
                  <div
                    key={section.id}
                    className={`px-4 py-2 text-sm cursor-pointer ${theme.sectionHover} ${
                      activeSection === section.id ? `${theme.sectionActive} font-medium border-l-4` : ''
                    }`}
                    onClick={() => onSectionClick(section.id)}
                  >
                    <div className="font-medium">{section.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{section.content}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))
      ) : (
        // Flat list of results
        results.map(section => (
          <div
            key={section.id}
            className={`px-4 py-2 text-sm cursor-pointer ${theme.sectionHover} ${
              activeSection === section.id ? `${theme.sectionActive} font-medium border-l-4` : ''
            }`}
            onClick={() => onSectionClick(section.id)}
          >
            <div className="font-medium">{section.title}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{section.content}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchResults;