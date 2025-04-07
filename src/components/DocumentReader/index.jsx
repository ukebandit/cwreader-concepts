import React, { useRef } from 'react';
import { DocumentProvider, useDocumentContext } from '../../context/DocumentContext';
import Header from './Header';
import TableOfContents from './TableOfContents';
import ContentArea from './ContentArea';
import ContextPanel from './ContextPanel';
import MobileDrawer from './MobileDrawer';
import ProgressBar from '../common/ProgressBar';

// Main wrapper component
const DocumentReaderWrapper = () => {
  return (
    <DocumentProvider>
      <DocumentReader />
    </DocumentProvider>
  );
};

// Main component that uses the context
const DocumentReader = () => {
  const { 
    theme,
    showProgress,
    calculateProgress,
    isLoading,
    isTocCollapsed,
    isContextPanelOpen
  } = useDocumentContext();

  const contentRef = useRef(null);

  return (
    <div className={`flex flex-col h-screen ${theme.bg} ${theme.text} transition-colors duration-300`}>
      <Header />
      
      {/* Reading Progress Bar */}
      {showProgress && (
        <ProgressBar progress={calculateProgress()} />
      )}
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* TOC Pane (desktop) */}
        <aside className={`${theme.panel} ${theme.border} border-r flex flex-col transition-all duration-300 md:static absolute inset-y-0 left-0 z-20
          ${isTocCollapsed ? 'md:w-0 md:opacity-0' : 'md:w-64 md:opacity-100'} 
          hidden md:flex`}>
          <TableOfContents />
        </aside>

        {/* Content Pane */}
        <main className="flex-1 flex flex-col overflow-hidden" ref={contentRef}>
          <ContentArea contentRef={contentRef} />
        </main>
        
        {/* Right Context Panel (desktop) */}
        <aside className={`${theme.panel} ${theme.border} border-l flex flex-col transition-all duration-300 md:static absolute inset-y-0 right-0 z-20
          ${isContextPanelOpen ? 'md:w-64 md:opacity-100' : 'md:w-0 md:opacity-0'} 
          hidden md:flex`}>
          <ContextPanel />
        </aside>
        
        {/* Mobile Drawer (slides up from bottom) */}
        <MobileDrawer />
      </div>
    </div>
  );
};

export default DocumentReaderWrapper;