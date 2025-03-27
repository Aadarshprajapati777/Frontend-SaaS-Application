# AI Document Chat SaaS - Frontend

The frontend application for the AI Document Chat SaaS platform, built with modern React and Tailwind CSS.

## Features

- **Modern UI Components** - Built with Tailwind CSS and shadcn UI
- **Authentication** - User login, registration, and profile management
- **Document Management** - Upload, organize, and manage documents
- **AI Model Training** - Create and train custom AI models on documents
- **Chat Interface** - Talk to your documents through AI-powered chat
- **Team Collaboration** - Share documents and models with team members
- **Responsive Design** - Works on desktop, tablet, and mobile devices

## Tech Stack

- React.js with Vite
- React Router for navigation
- Tailwind CSS for styling
- shadcn UI components
- React Query for data fetching
- Context API for state management
- Axios for API requests

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── ui/             # UI components (buttons, inputs, etc.)
│   ├── layout/         # Layout components
│   ├── forms/          # Form components
│   └── auth/           # Authentication components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and helpers
├── pages/              # Page components
├── services/           # API services
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## Getting Started

### Prerequisites

- Node.js v14+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Access the application:
```
http://localhost:5173
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```
VITE_API_URL=http://localhost:5000
```

## Deployment

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request
