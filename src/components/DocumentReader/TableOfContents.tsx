import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { DocumentSection, ThemeClasses, TocFilters } from '../../context/DocumentContext';

interface TableOfContentsProps {
  sections: DocumentSection[];
  activeSection: string | null;
  onSectionClick: (sectionId: string) => void;
  filters: TocFilters;
  theme: ThemeClasses;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  sections = [], 
  activeSection, 
  onSectionClick, 
  filters,
  theme
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  
  // Get unique books and chapters
  const getUniqueBooks = (): string[] => {
    const books = new Set<string>();
    
    const addBooks = (sections: DocumentSection[]) => {
      sections.forEach(section => {
        if (section.book) {
          books.add(section.book);
        }
        if (section.subsections && section.subsections.length > 0) {
          addBooks(section.subsections);
        }
      });
    };
    
    addBooks(sections);
    return Array.from(books).sort();
  };
  
  const getUniqueChapters = (book: string | null): string[] => {
    if (!book) return [];
    
    const chapters = new Set<string>();
    
    const addChapters = (sections: DocumentSection[]) => {
      sections.forEach(section => {
        if (section.book === book && section.chapter) {
          chapters.add(section.chapter);
        }
        if (section.subsections && section.subsections.length > 0) {
          addChapters(section.subsections);
        }
      });
    };
    
    addChapters(sections);
    return Array.from(chapters).sort();
  };

  // Filter sections by book and chapter
  const getFilteredSections = (): DocumentSection[] => {
    if (!selectedBook) return sections;
    
    const filterByBook = (sections: DocumentSection[]): DocumentSection[] => {
      const result: DocumentSection[] = [];
      
      for (const section of sections) {
        if (section.book === selectedBook && (!selectedChapter || section.chapter === selectedChapter)) {
          result.push(section);
        } else if (section.subsections && section.subsections.length > 0) {
          const filteredSubsections = filterByBook(section.subsections);
          if (filteredSubsections.length > 0) {
            result.push({
              ...section,
              subsections: filteredSubsections
            });
          }
        }
      }
      
      return result;
    };
    
    return filterByBook(sections);
  };
  
  // Set initial book and chapter based on active section
  useEffect(() => {
    if (activeSection && sections.length > 0) {
      const findSectionById = (sections: DocumentSection[], id: string): DocumentSection | null => {
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
      
      const activeContent = findSectionById(sections, activeSection);
      if (activeContent?.book && !selectedBook) {
        setSelectedBook(activeContent.book);
        if (activeContent.chapter) {
          setSelectedChapter(activeContent.chapter);
        }
      }
    }
  }, [activeSection, sections, selectedBook]);

  // Book dropdown change handler
  const handleBookChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const book = event.target.value === '' ? null : event.target.value;
    setSelectedBook(book);
    setSelectedChapter(null);
  };
  
  // Chapter dropdown change handler
  const handleChapterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const chapter = event.target.value === '' ? null : event.target.value;
    setSelectedChapter(chapter);
  };

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const renderSections = (sections: DocumentSection[], level = 0) => {
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

  const books = getUniqueBooks();
  const chapters = getUniqueChapters(selectedBook);
  const filteredSections = getFilteredSections();

  return (
    <div className="py-2">
      {/* Book dropdown */}
      <div className="px-3 mb-2">
        <label htmlFor="book-select" className="block text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">
          Book
        </label>
        <div className="relative">
          <select
            id="book-select"
            value={selectedBook || ''}
            onChange={handleBookChange}
            className={`w-full pl-3 pr-8 py-1.5 text-sm border rounded-md ${theme.input} appearance-none`}
          >
            <option value="">All Books</option>
            {books.map(book => (
              <option key={book} value={book}>{book}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Chapter dropdown (only shown if book is selected) */}
      {selectedBook && (
        <div className="px-3 mb-2">
          <label htmlFor="chapter-select" className="block text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">
            Chapter
          </label>
          <div className="relative">
            <select
              id="chapter-select"
              value={selectedChapter || ''}
              onChange={handleChapterChange}
              className={`w-full pl-3 pr-8 py-1.5 text-sm border rounded-md ${theme.input} appearance-none`}
            >
              <option value="">All Chapters</option>
              {chapters.map(chapter => (
                <option key={chapter} value={chapter}>{chapter}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </div>
      )}

      {/* No sections message */}
      {(!filteredSections || filteredSections.length === 0) && (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          No sections found
        </div>
      )}

      {/* Render sections */}
      {renderSections(filteredSections)}
    </div>
  );
};

export default TableOfContents;