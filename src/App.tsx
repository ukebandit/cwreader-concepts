import React from 'react'
import DocumentReader from './components/DocumentReader'
import { DocumentProvider } from './context/DocumentContext'

function App(): React.ReactElement {
  return (
    <DocumentProvider>
      <div className="h-screen w-screen">
        <DocumentReader />
      </div>
    </DocumentProvider>
  )
}

export default App