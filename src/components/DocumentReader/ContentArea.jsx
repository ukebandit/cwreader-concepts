import React, { useEffect } from 'react';
import { Home, ChevronRight, Star, Bookmark, Eye, EyeOff } from 'lucide-react';
import { useDocumentContext } from '../../context/DocumentContext';

const ContentArea = ({ contentRef }) => {
  const { 
    theme,
    isLoading,
    activeContent,
    breadcrumbs,
    handleSectionClick,
    getFontSizeClass,
    fontSize,
    setFontSize,
    showProgress,
    setShowProgress,
    calculateProgress
  } = useDocumentContext();

  // Scroll to section when activeContent changes
  useEffect(() => {
    if (activeContent && contentRef?.current) {
      const element = contentRef.current.querySelector(`#content-${activeContent.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [activeContent, contentRef]);

  return (
    <>
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
    
      {/* Content Area */}
      <div 
        className={`flex-1 overflow-y-auto p-6 pb-24 md:pb-6 ${getFontSizeClass()}`} // Extra padding for mobile drawer
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
      
      {/* Content Footer */}
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
            title={showProgress ? "Hide progress bar" : "Show progress bar"}
          >
            {showProgress ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <div className="flex items-center space-x-3">
          {/* Font size controls */}
          <div className="flex items-center space-x-1">
            <button
              className={`${theme.button} p-1 ${fontSize === 'small' ? 'font-semibold' : ''}`}
              onClick={() => setFontSize('small')}
              title="Small text"
            >
              <span className="text-xs">A</span>
            </button>
            <button
              className={`${theme.button} p-1 ${fontSize === 'medium' ? 'font-semibold' : ''}`}
              onClick={() => setFontSize('medium')}
              title="Medium text"
            >
              <span className="text-sm">A</span>
            </button>
            <button
              className={`${theme.button} p-1 ${fontSize === 'large' ? 'font-semibold' : ''}`}
              onClick={() => setFontSize('large')}
              title="Large text"
            >
              <span className="text-base">A</span>
            </button>
            <button
              className={`${theme.button} p-1 ${fontSize === 'x-large' ? 'font-semibold' : ''}`}
              onClick={() => setFontSize('x-large')}
              title="Extra large text"
            >
              <span className="text-lg">A</span>
            </button>
          </div>
          
          {/* Page indicator */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {calculateProgress()}%
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentArea;