# Clickstream WP Client

This is the React-based admin interface for the Clickstream WP WordPress plugin.

## Architecture

The client application is built with modern web technologies:

- **React**: Frontend UI library
- **TypeScript**: Static typing for better development experience
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast, modern build tool
- **React Router (Hash Router)**: For navigation within WordPress admin

## Key Features

- SPA (Single Page Application) experience within WordPress admin
- Communicates with WordPress via REST API
- TypeScript for type safety
- Responsive UI with Tailwind CSS
- Loading and error states for better UX

## Development

### Prerequisites

- Node.js (v16+)
- npm (v7+)

### Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

This will start a local development server at http://localhost:3000.

### Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be placed in the `../assets/admin` directory, which is where the WordPress plugin expects to find them.

## API Integration

The client communicates with the WordPress backend through REST API endpoints:

- `/clickstream-wp/v1/setup`: Setup configuration endpoints
- `/clickstream-wp/v1/privacy`: Privacy settings endpoints

API utilities are located in `src/utils/api.ts` with TypeScript interfaces for type safety.

## Project Structure

- `src/` - Source code
  - `components/` - Reusable React components
  - `pages/` - Page components for different admin sections
  - `utils/` - Utility functions including API client
  - `App.tsx` - Main application component
  - `main.tsx` - Application entry point
  - `index.html` - HTML template

## WordPress Integration

The admin interface is loaded by the WordPress admin area when users navigate to the Clickstream WP plugin pages. The integration code can be found in `../includes/class-clickstream-wp-admin.php`. 