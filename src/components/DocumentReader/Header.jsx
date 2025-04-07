import React, { useState } from 'react';
import { Menu, Share, Info, Settings, Moon, Sun } from 'lucide-react';
import { useDocumentContext } from '../../context/DocumentContext';
import ShareSheet from './ShareSheet';

const Header = () => {
  const { 
    theme,
    docContent,
    isTocCollapsed,
    isContextPanelOpen,
    activeTab,
    drawerState,
    darkMode,
    activeContent,
    setIsTocCollapsed,
    setIsContextPanelOpen,
    setActiveTab,
    setDarkMode,
    setActiveDrawerContent,
    setDrawerState
  } = useDocumentContext();
  
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);

  return (
    <>
      <header className={`${theme.panel} shadow-sm ${theme.border} border-b h-12 flex items-center px-4 z-10`}>
        <button 
          className={`mr-4 ${theme.button} md:flex hidden`}
          onClick={() => setIsTocCollapsed(!isTocCollapsed)}
        >
          <Menu size={20} />
        </button>
        
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
        
        <div className="ml-auto flex items-center space-x-3">
          {/* Light/Dark Mode toggle */}
          <button 
            className={`${theme.button}`}
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          {/* Share button */}
          <button 
            className={`${theme.button}`}
            onClick={() => setIsShareSheetOpen(true)}
            title="Share"
          >
            <Share size={18} />
          </button>
          
          {/* Mobile buttons */}
          <button 
            className={`md:hidden ${theme.button}`}
            onClick={() => {
              setActiveDrawerContent('toc');
              setDrawerState(drawerState === 'closed' ? 'peek' : 'closed');
            }}
          >
            <Menu size={20} />
          </button>
          
          {/* Desktop buttons */}
          <button 
            className={`md:flex hidden ${theme.button}`}
            onClick={() => setIsContextPanelOpen(!isContextPanelOpen)}
          >
            <Info size={18} />
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
      
      {/* Share Sheet */}
      <ShareSheet 
        isOpen={isShareSheetOpen} 
        onClose={() => setIsShareSheetOpen(false)} 
        section={activeContent}
      />
    </>
  );
};

export default Header;