import React, { useState } from 'react';
import { Menu, Info, Settings as SettingsIcon, X, Share } from 'lucide-react';
import { useDocumentContext } from '../../context/DocumentContext';
import TableOfContents from './TableOfContents';
import SearchResults from './SearchResults';
import Settings from './Settings';
import ShareSheet from './ShareSheet';

const MobileDrawer = () => {
  const { 
    theme,
    searchQuery,
    relatedLinks,
    drawerState,
    isLeftHanded,
    activeDrawerContent,
    activeContent,
    getDrawerHeight,
    toggleDrawer,
    setDrawerState,
    setActiveDrawerContent
  } = useDocumentContext();
  
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);

  return (
    <>
      <div 
        className={`fixed inset-x-0 bottom-0 ${theme.panel} shadow-lg rounded-t-xl 
          md:hidden z-30 transition-all duration-300 transform
          ${drawerState === 'closed' ? 'translate-y-full' : 'translate-y-0'} ${getDrawerHeight()}`}
      >
        {/* Drawer Handle */}
        <div 
          className="drawer-handle h-6 w-full flex items-center justify-center cursor-pointer"
          onClick={toggleDrawer}
        >
          <div className="h-1 w-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
        
        {/* Close button */}
        <button 
          className={`absolute top-2 right-3 ${theme.button} p-1`}
          onClick={() => setDrawerState('closed')}
        >
          <X size={18} />
        </button>
        
        {/* Drawer Content */}
        <div className="p-3 overflow-y-auto" style={{ height: 'calc(100% - 24px)' }}>
          {/* Navigation tabs */}
          <div className={`flex ${theme.border} border-b mb-3`}>
            <button 
              className={`flex-1 py-2 text-sm font-medium ${activeDrawerContent === 'toc' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveDrawerContent('toc')}
            >
              Contents
            </button>
            <button 
              className={`flex-1 py-2 text-sm font-medium ${activeDrawerContent === 'context' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveDrawerContent('context')}
            >
              Related
            </button>
            <button 
              className={`flex-1 py-2 text-sm font-medium ${activeDrawerContent === 'settings' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveDrawerContent('settings')}
            >
              Settings
            </button>
          </div>
          
          {/* TOC Content */}
          {activeDrawerContent === 'toc' && (
            <>
              <div className="mb-3">
                <TableOfContents />
              </div>
            </>
          )}
          
          {/* Context Content */}
          {activeDrawerContent === 'context' && (
            <div>
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Related Content
                </h4>
                <ul className="space-y-2">
                  {relatedLinks && relatedLinks.length > 0 ? relatedLinks.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.url} 
                        className="block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                      >
                        {link.title}
                      </a>
                    </li>
                  )) : (
                    <li className="text-sm text-gray-500 dark:text-gray-400">No related content found</li>
                  )}
                </ul>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Notes
                </h4>
                <div className={`${theme.card} p-3 rounded-md border text-sm`}>
                  This section provides an overview of the document system's architecture. The integration section contains specific implementation details.
                </div>
              </div>
            </div>
          )}
          
          {/* Settings Content */}
          {activeDrawerContent === 'settings' && (
            <Settings />
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
            
            {/* Share button */}
            <button 
              className="h-12 w-12 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center"
              onClick={() => setIsShareSheetOpen(true)}
            >
              <Share size={20} />
            </button>
            
            {drawerState !== 'closed' && (
              <>
                <button 
                  className={`h-10 w-10 rounded-full ${activeDrawerContent === 'context' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'} text-white shadow-lg flex items-center justify-center`}
                  onClick={() => {
                    setActiveDrawerContent('context');
                    if (drawerState === 'closed') setDrawerState('peek');
                  }}
                >
                  <Info size={18} />
                </button>
                <button 
                  className={`h-10 w-10 rounded-full ${activeDrawerContent === 'settings' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'} text-white shadow-lg flex items-center justify-center`}
                  onClick={() => {
                    setActiveDrawerContent('settings');
                    if (drawerState === 'closed') setDrawerState('peek');
                  }}
                >
                  <SettingsIcon size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Share Sheet */}
      <ShareSheet 
        isOpen={isShareSheetOpen} 
        onClose={() => setIsShareSheetOpen(false)} 
        section={activeContent}
      />
    </>
  );
};

export default MobileDrawer;