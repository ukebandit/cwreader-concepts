# CW Reader - Document Viewer Concepts

A modern, responsive document viewer for web applications built with React and Tailwind CSS. This project explores reader interface concepts for structured documents, emphasizing readability, navigation, and responsive design.

## Features

- **Responsive Design**: Optimized for both desktop and mobile devices
- **Dark/Light Mode**: Full theme support with seamless transitions
- **Content Navigation**: Hierarchical table of contents with filtering
- **Search**: Full-text search within document content
- **Progress Tracking**: Visual reading progress indicators
- **Mobile Optimizations**: Touch-friendly controls and adaptive layout
- **User Preferences**: Font size, handedness setting, content filters

## Project Structure

The main document reader component is structured as follows:

```
src/
├── components/
│   ├── DocumentReader/   # Main document reader component
│   │   ├── index.jsx     # Component entry point
│   │   ├── Header.jsx    # App header with controls
│   │   ├── TableOfContents.jsx
│   │   ├── ContentArea.jsx
│   │   ├── ContextPanel.jsx
│   │   ├── Settings.jsx
│   │   ├── SearchResults.jsx
│   │   └── MobileDrawer.jsx
│   └── common/           # Shared components
│       └── ProgressBar.jsx
├── context/
│   └── DocumentContext.jsx  # State management
└── utils/
    └── documentUtils.js     # Document processing utilities
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cwreader-concepts.git
   cd cwreader-concepts
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

The document reader loads with sample content by default. In a real application, you would:

1. Load document content from an API or local data source
2. Customize theme and appearance as needed
3. Integrate with your application's state management

See the [component documentation](./src/components/DocumentReader/README.md) for more details.

## Documentation

- [Technical Documentation](./docs/technical-documentation.md) - Detailed architecture and implementation
- [Usage Guide](./docs/usage-guide.md) - How to use and customize the component

## Future Enhancements

- Document annotations and highlighting
- Custom document themes
- Offline reading support
- Collaborative reading features
- Content export options

## License

[MIT License](./LICENSE)

## Acknowledgments

- Built with [React](https://reactjs.org/) and [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
