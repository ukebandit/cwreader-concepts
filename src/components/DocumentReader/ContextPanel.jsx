import React from 'react';
import { Share, Info, Bookmark, Filter, Heart } from 'lucide-react';
import { useDocumentContext } from '../../context/DocumentContext';

const ContextPanel = () => {
  const { 
    theme,
    relatedLinks,
    contextFilters,
    contentFilters,
    setContextFilters,
    setContentFilters,
    toggleFilter
  } = useDocumentContext();

  return (
    <>
      {/* Context Panel Header */}
      <div className={`p-3 ${theme.border} border-b flex items-center justify-between ${theme.panel === 'bg-white' ? 'bg-gray-50' : theme.panel}`}>
        <h3 className="text-sm font-medium">Related</h3>
        <div className="flex space-x-1">
          <button 
            className={`p-1.5 rounded ${contextFilters.related ? theme.activeButton : `${theme.button} ${theme.hoverBg}`}`}
            onClick={() => toggleFilter(contextFilters, setContextFilters, 'related')}
            title="Show related links"
          >
            <Share size={16} />
          </button>
          <button 
            className={`p-1.5 rounded ${contextFilters.references ? theme.activeButton : `${theme.button} ${theme.hoverBg}`}`}
            onClick={() => toggleFilter(contextFilters, setContextFilters, 'references')}
            title="Show references"
          >
            <Info size={16} />
          </button>
          <button 
            className={`p-1.5 rounded ${contextFilters.notes ? theme.activeButton : `${theme.button} ${theme.hoverBg}`}`}
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
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Related Content
            </h4>
            <ul className="space-y-2">
              {relatedLinks.length > 0 ? relatedLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url} 
                    className="block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                  >
                    {link.title}
                  </a>
                </li>
              )) : (
                <li className="text-sm text-gray-500 dark:text-gray-400">No related content for this section</li>
              )}
            </ul>
          </div>
        )}
        
        {contextFilters.references && (
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              References
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#ref1" className="block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline">
                  Document Design Patterns
                </a>
              </li>
              <li>
                <a href="#ref2" className="block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline">
                  Web Content Accessibility Guidelines
                </a>
              </li>
              <li>
                <a href="#ref3" className="block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline">
                  React Patterns for Document Systems
                </a>
              </li>
            </ul>
          </div>
        )}
        
        {contextFilters.notes && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Notes
            </h4>
            <div className={`${theme.card} p-3 rounded-md border text-sm`}>
              This section provides an overview of the document system's architecture. The integration section contains specific implementation details.
            </div>
          </div>
        )}
      </div>
      
      {/* Context Panel Footer */}
      <div className={`p-3 ${theme.border} border-t flex items-center justify-between ${theme.panel === 'bg-white' ? 'bg-gray-50' : theme.panel}`}>
        <div className="flex space-x-1">
          <button 
            className={`p-1.5 rounded ${contentFilters.images ? theme.activeButton : `${theme.button} ${theme.hoverBg}`}`}
            onClick={() => toggleFilter(contentFilters, setContentFilters, 'images')}
            title="Show images"
          >
            <Filter size={16} />
          </button>
          <button 
            className={`p-1.5 rounded ${contentFilters.tables ? theme.activeButton : `${theme.button} ${theme.hoverBg}`}`}
            onClick={() => toggleFilter(contentFilters, setContentFilters, 'tables')}
            title="Show tables"
          >
            <Filter size={16} />
          </button>
          <button 
            className={`p-1.5 rounded ${contentFilters.code ? theme.activeButton : `${theme.button} ${theme.hoverBg}`}`}
            onClick={() => toggleFilter(contentFilters, setContentFilters, 'code')}
            title="Show code"
          >
            <Filter size={16} />
          </button>
        </div>
        <button className={`p-1.5 rounded ${theme.button} ${theme.hoverBg}`} title="Favorite">
          <Heart size={16} />
        </button>
      </div>
    </>
  );
};

export default ContextPanel;