# Facebook Simulator

A full-stack Facebook-like social media platform built with FastAPI (Python) backend and React (TypeScript) frontend.

## Quick Start

### Prerequisites
- Python 3.8+ installed
- Node.js 16+ installed
- Git (optional)

### 🚀 Running the Application

#### Backend (Terminal 1)
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment (first time only)
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Run the backend server
python main.py
```

Backend will be available at:
- **API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

#### Frontend (Terminal 2)
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Run the frontend development server
npm run dev
```

Frontend will be available at:
- **App:** http://localhost:5173

### 🎯 Demo Credentials
- **Username:** john_doe
- **Password:** password123

## Features

### 🔐 Authentication
- User registration and login
- JWT token-based authentication
- Secure password hashing
- Refresh token mechanism
- HTTP-only cookies for security

### 📱 Social Features
- Create, read, update, delete posts
- Like/unlike posts and comments
- Comment system with replies
- Real-time chat messaging
- Online/offline user status
- User profiles and friend system

### 🚀 Real-time Features
- WebSocket-based chat
- Typing indicators
- Online status updates
- Real-time notifications

### 💻 Technical Features
- RESTful API with FastAPI
- Real-time WebSocket connections
- SQLite database (easily upgradeable to PostgreSQL)
- React with TypeScript frontend
- Tailwind CSS for styling
- Responsive design

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation using Python type annotations
- **JWT** - JSON Web Tokens for authentication
- **WebSockets** - Real-time communication
- **SQLite** - Database (development)
- **Uvicorn** - ASGI server

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

## Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Option 1: Using Start Scripts (Recommended)

#### Windows
```bash
# Double-click start.bat or run in command prompt
start.bat
```

#### Linux/macOS
```bash
# Make script executable and run
chmod +x start.sh
./start.sh
```

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start server
python main.py
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL=sqlite:///./facebook_simulator.db

# JWT Security
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production-2024
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7

# Server
PORT=8000
HOST=127.0.0.1
DEBUG=True

# CORS
FRONTEND_URL=http://localhost:5173

# WebSocket
WEBSOCKET_URL=ws://localhost:8000/ws

# Upload settings
MAX_FILE_SIZE=10485760
UPLOAD_FOLDER=uploads/
```

### Frontend (.env)
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WEBSOCKET_URL=ws://localhost:8000/ws

# App Configuration
VITE_APP_NAME=Facebook Simulator
VITE_APP_VERSION=1.0.0

# Development
VITE_ENV=development
VITE_DEBUG=true

# Upload settings
VITE_MAX_FILE_SIZE=10485760
VITE_ACCEPTED_IMAGE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get posts (paginated)
- `POST /api/posts` - Create new post
- `GET /api/posts/{id}` - Get specific post
- `PUT /api/posts/{id}` - Update post
- `DELETE /api/posts/{id}` - Delete post
- `POST /api/posts/{id}/like` - Toggle like on post

### WebSocket
- `WS /ws` - WebSocket endpoint for real-time features

## Project Structure

```
Facebook_Simulator/
├── backend/
│   ├── app/
│   │   ├── api/           # API route handlers
│   │   ├── core/          # Core functionality (auth, config, database)
│   │   ├── models/        # Database models and schemas
│   │   └── services/      # Business logic services
│   ├── main.py           # FastAPI application entry point
│   ├── requirements.txt  # Python dependencies
│   └── .env             # Backend environment variables
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Utility functions
│   ├── package.json     # Node.js dependencies
│   └── .env            # Frontend environment variables
├── start.bat           # Windows startup script
├── start.sh            # Linux/macOS startup script
└── README.md          # This file
```

## Development

### Adding New Features
1. Backend: Add new routes in `backend/app/api/`
2. Frontend: Create components in `frontend/src/components/`
3. Update types in `frontend/src/types/`

### Database Changes
1. Modify models in `backend/app/models/database.py`
2. The database will be automatically created/updated on server start

### Environment Setup
- Copy `.env.example` files and customize for your environment
- Never commit `.env` files to version control

### 🛠️ VS Code Integration

This project includes VS Code tasks and launch configurations for easier development:

#### Tasks (Ctrl+Shift+P → "Tasks: Run Task")
- **Start Backend** - Starts the FastAPI server
- **Start Frontend** - Starts the React dev server  
- **Start Both Servers** - Runs both backend and frontend in parallel
- **Install Backend Dependencies** - Installs Python packages
- **Install Frontend Dependencies** - Installs Node.js packages

#### Debug Configurations (F5)
- **Python: FastAPI Backend** - Debug the backend with breakpoints
- **Launch Chrome against localhost:5173** - Debug frontend in Chrome
- **Launch Full Stack** - Debug both backend and frontend

### 📁 Alternative Startup Methods

#### Using Scripts
**Windows:**
```bash
# Terminal 1 - Backend
cd backend
dev.bat

# Terminal 2 - Frontend  
cd frontend
dev.bat
```

**macOS/Linux:**
```bash
# Terminal 1 - Backend
cd backend
./dev.sh

# Terminal 2 - Frontend
cd frontend
./dev.sh
```

## Production Deployment

### Backend
1. Set `DEBUG=False` in environment
2. Use PostgreSQL instead of SQLite
3. Configure proper CORS origins
4. Use a production ASGI server like Gunicorn
5. Set secure JWT secret keys

### Frontend
1. Build for production: `npm run build`
2. Serve static files with a web server (Nginx, Apache)
3. Configure environment variables for production API URLs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Happy coding! 🚀
