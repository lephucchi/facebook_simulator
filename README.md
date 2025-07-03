# Facebook Simulator

🚀 Một nền tảng mạng xã hội tương tự Facebook được xây dựng hoàn chỉnh với backend FastAPI (Python) và frontend React (TypeScript).

## 🎯 Tổng quan dự án

Facebook Simulator là một ứng dụng web full-stack mô phỏng các tính năng chính của Facebook, bao gồm:

- 📝 **Đăng bài và tương tác**: Tạo post, like/reaction, comment
- 💬 **Chat thời gian thực**: Tin nhắn real-time với WebSocket
- 📖 **Stories**: Chia sẻ khoảnh khắc tạm thời (24h)
- 🔐 **Authentication**: Đăng ký/đăng nhập với JWT
- 👥 **Quản lý người dùng**: Profile, avatar, online status
- 📱 **Responsive Design**: Tương thích với mọi thiết bị

Dự án được thiết kế với kiến trúc hiện đại, có thể mở rộng và dễ bảo trì.

## 🎯 Demo Credentials
- **Username:** john_doe
- **Password:** password123

## 🌟 Features Highlights
- ✅ Real-time messaging với WebSocket
- ✅ JWT Authentication với refresh token
- ✅ File upload cho images
- ✅ Reactions system (like, love, haha, wow, angry)
- ✅ Stories với auto-expire
- ✅ Responsive UI với Tailwind CSS
- ✅ TypeScript cho type safety

## 🚀 Khởi động nhanh

### ⚡ Yêu cầu hệ thống
- **Python 3.8+** (khuyến nghị 3.11+)
- **Node.js 16+** (khuyến nghị 18+)
- **Git** (tùy chọn)

### 🔧 Cài đặt và chạy

#### Backend (Terminal 1)
```bash
# Điều hướng đến thư mục backend
cd backend

# Tạo và kích hoạt môi trường ảo (chỉ cần làm một lần)
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Cài đặt dependencies (chỉ cần làm một lần)
pip install -r requirements.txt

# Chạy backend server
python main.py
```

🌐 **Backend sẽ chạy tại:**
- **API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

#### Frontend (Terminal 2)
```bash
# Điều hướng đến thư mục frontend
cd frontend

# Cài đặt dependencies (chỉ cần làm một lần)
npm install

# Chạy frontend development server
npm run dev
```

🎨 **Frontend sẽ chạy tại:**
- **App:** http://localhost:5173

## 🏗️ Kiến trúc hệ thống

### 🔧 Tech Stack
**Backend:**
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM và database toolkit
- **JWT** - Authentication với JSON Web Tokens
- **WebSocket** - Real-time communication
- **SQLite** - Database (có thể upgrade PostgreSQL)

**Frontend:**
- **React 19** - UI library với hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool với HMR

### 🗂️ Backend Structure (FastAPI + Python)
```
backend/
├── app/
│   ├── api/               # API route handlers
│   │   ├── auth.py       # Authentication endpoints
│   │   ├── posts.py      # Posts CRUD operations
│   │   ├── messages.py   # Chat messaging API
│   │   ├── stories.py    # Stories functionality
│   │   └── websocket.py  # Real-time WebSocket handlers
│   ├── core/              # Core functionality
│   │   ├── auth.py       # JWT authentication logic
│   │   ├── config.py     # Application configuration
│   │   └── database.py   # Database connection setup
│   ├── models/            # Data models và schemas
│   │   ├── database.py   # SQLAlchemy ORM models
│   │   └── schemas.py    # Pydantic request/response schemas
│   └── services/          # Business logic services
│       ├── init_data.py  # Sample data initialization
│       └── websocket.py  # WebSocket connection manager
├── uploads/              # File upload directory
├── main.py               # FastAPI application entry point
├── requirements.txt      # Python dependencies
└── facebook_simulator.db # SQLite database file
```

### 🎨 Frontend Structure (React + TypeScript)
```
frontend/
├── src/
│   ├── components/       # React components
│   │   ├── chat/        # Chat-related components
│   │   │   └── ChatWindow.tsx    # Individual chat interface
│   │   ├── layout/      # Layout components
│   │   │   ├── Navbar.tsx        # Main navigation bar
│   │   │   ├── Sidebar.tsx       # Left sidebar menu
│   │   │   └── RightSidebar.tsx  # Right sidebar
│   │   ├── newsfeed/    # News feed components
│   │   │   ├── CreatePost.tsx    # Post creation form
│   │   │   ├── PostCard.tsx      # Individual post display
│   │   │   ├── CommentSection.tsx # Comments display
│   │   │   ├── Stories.tsx       # Stories carousel
│   │   │   └── StoryViewer.tsx   # Full-screen story viewer
│   │   └── ui/          # Reusable UI components
│   │       ├── Avatar.tsx        # User avatar component
│   │       ├── Button.tsx        # Custom button component
│   │       ├── ReactionPicker.tsx # Post reaction selector
│   │       └── MessengerDropdown.tsx # Chat dropdown
│   ├── hooks/           # Custom React hooks
│   │   └── useAuth.tsx  # Authentication state management
│   ├── pages/           # Page components
│   │   ├── Login.tsx    # Login/Register page
│   │   ├── Newsfeed.tsx # Main newsfeed page
│   │   └── Profile.tsx  # User profile page
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts     # Global type definitions
│   └── utils/           # Utility functions
│       └── api.ts       # API client và WebSocket setup
├── public/              # Static files
├── package.json         # Node.js dependencies
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.ts      # Vite build configuration
```

## 🔧 Chi tiết các tính năng

### 🔐 Hệ thống Authentication
- **Đăng ký/Đăng nhập:** Form validation với email/username
- **JWT Tokens:** Access token (1 giờ) + Refresh token (7 ngày)
- **Password Security:** Bcrypt hashing
- **Session Management:** HTTP-only cookies cho refresh tokens
- **Auto-refresh:** Tự động làm mới token khi hết hạn

**Endpoints:**
```
POST /api/auth/register - Đăng ký tài khoản mới
POST /api/auth/login    - Đăng nhập
POST /api/auth/logout   - Đăng xuất
POST /api/auth/refresh  - Làm mới access token
GET  /api/auth/me       - Lấy thông tin user hiện tại
GET  /api/auth/users    - Lấy danh sách tất cả users
```

### 📱 Tính năng Social Media

#### Posts Management
- **CRUD Operations:** Tạo, đọc, cập nhật, xóa bài viết
- **Rich Content:** Text content + image uploads
- **Pagination:** Phân trang với 10 bài/trang
- **Authorization:** Chỉ author mới có thể sửa/xóa bài

**Database Schema:**
```sql
posts:
- id (Primary Key)
- content (Text)
- image_url (String, optional)
- author_id (Foreign Key -> users.id)
- created_at, updated_at (Timestamps)
```

**Endpoints:**
```
GET    /api/posts              - Lấy danh sách bài viết (có phân trang)
POST   /api/posts              - Tạo bài viết mới
GET    /api/posts/{id}         - Lấy bài viết theo ID
PUT    /api/posts/{id}         - Cập nhật bài viết
DELETE /api/posts/{id}         - Xóa bài viết
GET    /api/posts/sample       - Lấy bài viết mẫu (không cần auth)
```

#### Reactions System
- **Multiple Reactions:** like, love, haha, wow, angry
- **Toggle Logic:** Click cùng reaction để remove
- **Real-time Updates:** Cập nhật số lượng reaction ngay lập tức
- **User Tracking:** Theo dõi reaction của từng user

**Database Schema:**
```sql
post_reactions:
- id (Primary Key)
- user_id (Foreign Key -> users.id)
- post_id (Foreign Key -> posts.id)
- reaction_type (String: like, love, haha, wow, angry)
- created_at, updated_at (Timestamps)
- UNIQUE(user_id, post_id) - Mỗi user chỉ có 1 reaction/post
```

**Endpoints:**
```
POST /api/posts/{id}/like      - Toggle like (legacy)
POST /api/posts/{id}/reactions - Add/update/remove reaction
```

#### Comments System
- **Nested Comments:** Hỗ trợ reply (parent_comment_id)
- **Rich Display:** Author info, timestamps, like counts
- **Real-time:** Hiển thị ngay sau khi tạo
- **Authorization:** Author có thể xóa comment của mình

**Database Schema:**
```sql
comments:
- id (Primary Key)
- content (Text)
- post_id (Foreign Key -> posts.id)
- author_id (Foreign Key -> users.id)
- parent_comment_id (Foreign Key -> comments.id, nullable)
- created_at, updated_at (Timestamps)
```

**Endpoints:**
```
POST /api/posts/{id}/comments - Tạo comment mới
```

### 💬 Real-time Chat System

#### WebSocket Architecture
- **Connection Management:** Theo dõi user online/offline
- **Message Broadcasting:** Gửi tin nhắn real-time
- **Typing Indicators:** Hiển thị khi user đang gõ
- **Read Receipts:** Đánh dấu tin nhắn đã đọc

**WebSocket Events:**
```javascript
// Gửi tin nhắn
{
  "type": "message",
  "receiver_id": 123,
  "content": "Hello!"
}

// Typing indicator
{
  "type": "typing", 
  "receiver_id": 123,
  "is_typing": true
}

// Đánh dấu đã đọc
{
  "type": "mark_read",
  "other_user_id": 123
}
```

#### Messages Database
```sql
messages:
- id (Primary Key)
- content (Text)
- sender_id (Foreign Key -> users.id)
- receiver_id (Foreign Key -> users.id)
- is_read (Boolean, default False)
- created_at (Timestamp)
```

#### Chat Features
- **Private Messaging:** Chat 1-1 giữa users
- **Message History:** Lưu trữ và tải lại tin nhắn cũ
- **Online Status:** Hiển thị user online/offline
- **Unread Count:** Đếm số tin nhắn chưa đọc
- **Message Persistence:** Tin nhắn được lưu trong database

**Chat Endpoints:**
```
GET  /api/messages/chats           - Lấy danh sách chat
GET  /api/messages/{user_id}       - Lấy tin nhắn với user
POST /api/messages/{user_id}       - Gửi tin nhắn
POST /api/messages/{user_id}/mark-read - Đánh dấu đã đọc
WS   /ws?token={jwt_token}         - WebSocket connection
```

### 📖 Stories System
- **Temporary Content:** Stories tự động expire sau 24 giờ
- **Multiple Images:** Hỗ trợ nhiều ảnh per story
- **Story Viewer:** Full-screen viewer với navigation
- **View Tracking:** Theo dõi ai đã xem story (TODO)

**Database Schema:**
```sql
stories:
- id (Primary Key)
- author_id (Foreign Key -> users.id)
- title (String, optional)
- created_at (Timestamp)
- expires_at (Timestamp, +24 hours)

story_images:
- id (Primary Key)
- story_id (Foreign Key -> stories.id)
- image_url (String)
- caption (Text, optional)
- order_index (Integer)
- created_at (Timestamp)
```

**Endpoints:**
```
GET  /api/stories              - Lấy stories đang active
POST /api/stories/{id}/view    - Đánh dấu đã xem story
```

### 👥 User Management
- **User Profiles:** Full name, username, email, avatar, bio
- **Online Status:** Theo dõi trạng thái online/offline
- **Friend System:** Relationships giữa users (TODO: expand)
- **Avatar Management:** Upload và hiển thị avatar

**Database Schema:**
```sql
users:
- id (Primary Key)
- email (String, unique)
- username (String, unique)
- full_name (String)
- hashed_password (String)
- avatar_url (String, optional)
- bio (Text, optional)
- is_active (Boolean, default True)
- is_online (Boolean, default False)
- last_seen (Timestamp)
- created_at, updated_at (Timestamps)

friendships (Many-to-Many):
- user_id (Foreign Key -> users.id)
- friend_id (Foreign Key -> users.id)
```

## 🔧 Tech Stack Details

### Backend Technologies
- **FastAPI 0.104.1:** Modern Python web framework
  - Automatic API documentation (Swagger/OpenAPI)
  - Type hints và validation
  - Async/await support
  - High performance
- **SQLAlchemy 1.4.50:** SQL toolkit và ORM
  - Declarative models
  - Relationship management
  - Query optimization
- **Pydantic 2.5.0:** Data validation
  - Type-safe request/response models
  - Automatic JSON serialization
  - Schema generation
- **Python-JOSE:** JWT token handling
- **Passlib[bcrypt]:** Password hashing
- **WebSockets 12.0:** Real-time communication
- **Uvicorn:** ASGI server

### Frontend Technologies
- **React 19:** Modern UI library
  - Hooks-based architecture
  - Component composition
  - Virtual DOM optimization
- **TypeScript 5.8.3:** Type-safe JavaScript
  - Interface definitions
  - Compile-time error checking
  - Better IDE support
- **Tailwind CSS 3.4.17:** Utility-first CSS
  - Responsive design
  - Dark mode support
  - Custom component styling
- **Vite 7.0.0:** Fast build tool
  - Hot Module Replacement (HMR)
  - Fast builds
  - ES modules support
- **Lucide React:** Icon library

### Database Design
- **SQLite:** Development database
  - File-based, zero-configuration
  - ACID compliance
  - Easily upgradeable to PostgreSQL
- **Relationships:**
  - One-to-Many: User -> Posts, Posts -> Comments
  - Many-to-Many: Users <-> Friends, Users <-> Liked Posts
  - Foreign Keys: Proper referential integrity

## 🔒 Security Features

### Authentication Security
- **JWT Best Practices:**
  - Short-lived access tokens (1 hour)
  - Long-lived refresh tokens (7 days)
  - HTTP-only cookies cho refresh tokens
  - Secure token storage
- **Password Security:**
  - Bcrypt hashing with salt
  - Minimum password requirements
  - Protection against timing attacks
- **CORS Configuration:**
  - Specific origin allowlist
  - Credentials support
  - Method và header restrictions

### API Security
- **Authorization Middleware:**
  - Token validation on protected routes
  - User context injection
  - Optional authentication support
- **Input Validation:**
  - Pydantic schema validation
  - SQL injection protection
  - XSS prevention
- **Error Handling:**
  - Consistent error responses
  - Security information leakage prevention

## �️ Cấu hình môi trường

### 🔧 Backend Environment (.env)
Tạo file `.env` trong thư mục `backend/`:
```env
# Database
DATABASE_URL=sqlite:///./facebook_simulator.db

# JWT Security
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production-2024
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7

# Server Configuration
PORT=8000
HOST=127.0.0.1
DEBUG=True

# CORS
FRONTEND_URL=http://localhost:5173

# WebSocket
WEBSOCKET_URL=ws://localhost:8000/ws

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_FOLDER=uploads/
```

### 🎨 Frontend Environment (.env)
Tạo file `.env` trong thư mục `frontend/`:
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

# File Upload
VITE_MAX_FILE_SIZE=10485760
VITE_ACCEPTED_IMAGE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

## 🚀 Development Setup

### 📦 Cài đặt Dependencies

#### Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

**Các package chính:**
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `sqlalchemy` - ORM
- `python-jose[cryptography]` - JWT
- `passlib[bcrypt]` - Password hashing
- `python-multipart` - File uploads

#### Frontend Dependencies
```bash
cd frontend
npm install
```

**Các package chính:**
- `react` - UI library
- `typescript` - Type checking
- `tailwindcss` - CSS framework
- `vite` - Build tool
- `lucide-react` - Icons

### 🔄 Development Commands

#### Backend
```bash
# Run development server
python main.py

# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Initialize sample data
curl -X POST http://localhost:8000/api/init-sample-data
```

#### Frontend
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### Development Workflow

#### Thêm tính năng mới
1. **Backend:**
   - Tạo model trong `backend/app/models/database.py`
   - Tạo schema trong `backend/app/models/schemas.py`
   - Implement API routes trong `backend/app/api/`
   - Thêm business logic trong `backend/app/services/`

2. **Frontend:**
   - Tạo TypeScript types trong `frontend/src/types/`
   - Implement components trong `frontend/src/components/`
   - Thêm API calls trong `frontend/src/utils/api.ts`
   - Create pages trong `frontend/src/pages/`

#### Database Migration
1. Modify models trong `backend/app/models/database.py`
2. Database sẽ tự động được tạo/cập nhật khi start server
3. Cho production, implement proper migration system với Alembic

#### Testing Strategy
- **Backend:** Unit tests với pytest
- **Frontend:** Component tests với React Testing Library
- **Integration:** API endpoint testing
- **E2E:** End-to-end testing với Playwright

## 📊 API Documentation

### Complete API Reference

#### Authentication APIs
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "password": "securepassword"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {"user_id": 123}
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "username",
  "password": "password"
}

Response: 200 OK
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGci...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

#### Posts APIs
```http
GET /api/posts?page=1&per_page=10
Authorization: Bearer {access_token}

Response: 200 OK
[
  {
    "id": 1,
    "content": "Post content",
    "image_url": "https://example.com/image.jpg",
    "author": {
      "id": 123,
      "username": "user",
      "full_name": "User Name",
      "avatar_url": "https://example.com/avatar.jpg"
    },
    "created_at": "2024-01-01T12:00:00Z",
    "likes_count": 5,
    "comments_count": 3,
    "is_liked": false,
    "current_user_reaction": null,
    "reactions": [...],
    "comments": [...]
  }
]
```

#### WebSocket Protocol
```javascript
// Connection
const ws = new WebSocket('ws://localhost:8000/ws?token={jwt_token}');

// Send message
ws.send(JSON.stringify({
  "type": "message",
  "receiver_id": 123,
  "content": "Hello there!"
}));

// Receive message
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'message') {
    // Handle incoming message
    console.log(`Message from ${data.sender.username}: ${data.content}`);
  }
};
```

## 🎨 UI/UX Design

### Design System
- **Color Palette:**
  - Primary: Blue (#1877F2) - Facebook blue
  - Secondary: Gray (#65676B)
  - Success: Green (#42B883)
  - Danger: Red (#E11D48)
  - Background: Light Gray (#F0F2F5)

- **Typography:**
  - Font Family: System fonts stack
  - Sizes: text-xs to text-4xl
  - Weights: font-normal, font-medium, font-semibold, font-bold

- **Components:**
  - Consistent spacing với Tailwind utilities
  - Rounded corners (rounded-lg, rounded-full)
  - Shadow system (shadow-sm, shadow-md, shadow-lg)
  - Hover effects và transitions

### Responsive Design
- **Mobile First:** Thiết kế ưu tiên mobile
- **Breakpoints:**
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
- **Layout:** Flexible grid system với Tailwind CSS

## 🔮 Roadmap & Future Enhancements

### ✅ Hoàn thành
- [x] Authentication system với JWT
- [x] Posts CRUD với reactions
- [x] Real-time chat với WebSocket
- [x] Stories với auto-expire
- [x] File upload system
- [x] Responsive UI design
- [x] Comments system
- [x] Online status tracking

### 🚧 Đang phát triển
- [ ] **Notification System** - Push notifications cho activities
- [ ] **Advanced Search** - Tìm kiếm users, posts, content
- [ ] **User Settings** - Cài đặt privacy, preferences
- [ ] **Password Reset** - Quên mật khẩu qua email

### 🔮 Phase 1: Core Features
- [ ] **Friend System** - Gửi/nhận friend requests
- [ ] **Groups** - Tạo và tham gia groups
- [ ] **Events** - Tạo và quản lý events
- [ ] **Photo Albums** - Tổ chức ảnh theo albums
- [ ] **Video Posts** - Upload và share videos

### 🎯 Phase 2: Advanced Features
- [ ] **AI Content Recommendation** - Gợi ý nội dung phù hợp
- [ ] **Content Moderation** - Auto-detect inappropriate content
- [ ] **Advanced Privacy Settings** - Kiểm soát visibility
- [ ] **Analytics Dashboard** - Insights cho content creators
- [ ] **Dark Mode** - Theme switching

### 🚀 Phase 3: Scalability
- [ ] **Mobile App** - React Native app
- [ ] **Microservices** - Break down monolith
- [ ] **Redis Caching** - Performance optimization
- [ ] **CDN Integration** - Fast content delivery
- [ ] **Database Optimization** - PostgreSQL + sharding

## 🏗️ Production Deployment

### Backend Deployment
```bash
# Production environment setup
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker

# Database migration to PostgreSQL
DATABASE_URL=postgresql://user:password@localhost/dbname

# Security configurations
DEBUG=False
JWT_SECRET_KEY=secure-production-key
CORS_ORIGINS=["https://yourdomain.com"]
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve với Nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8000;
    }
    
    location /ws {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Docker Deployment
```dockerfile
# Dockerfile.backend
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]

# Dockerfile.frontend
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/facebook_simulator
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=facebook_simulator
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🐛 Troubleshooting & FAQ

### ❓ Common Issues

#### 🔧 Backend Issues
```bash
# Port đã được sử dụng
❌ Error: [Errno 48] Address already in use
✅ Solution: 
   - Kill existing process: netstat -ano | findstr :8000
   - Or change port in config.py

# Database locked
❌ Error: database is locked
✅ Solution: 
   - Đóng tất cả connections
   - Restart backend server
   - Delete database file để reset

# Module import errors
❌ Error: ModuleNotFoundError: No module named 'app'
✅ Solution: 
   - Activate virtual environment
   - Install dependencies: pip install -r requirements.txt
   - Run from backend directory
```

#### 🎨 Frontend Issues
```bash
# Node modules issues
❌ Error: Module not found
✅ Solution: 
   - Delete node_modules: rm -rf node_modules
   - Clear npm cache: npm cache clean --force
   - Reinstall: npm install

# Port conflicts
❌ Error: Port 5173 is already in use
✅ Solution: 
   - Use different port: npm run dev -- --port 3000
   - Or kill existing process

# TypeScript errors
❌ Error: Type errors in build
✅ Solution: 
   - Check type definitions in types/index.ts
   - Run type check: npm run type-check
```

#### 🔗 WebSocket/API Issues
```bash
# CORS errors
❌ Error: Cross-origin request blocked
✅ Solution: 
   - Check CORS settings in backend main.py
   - Verify frontend URL in allowed origins

# WebSocket connection failed
❌ Error: WebSocket connection failed
✅ Solution: 
   - Check backend server running
   - Verify JWT token is valid
   - Check network/firewall settings

# API authentication errors
❌ Error: 401 Unauthorized
✅ Solution: 
   - Check JWT token in localStorage
   - Verify token format and expiry
   - Re-login if token expired
```

### 🔍 Debug Tips

#### Backend Debugging
```python
# Enable debug mode
DEBUG=True in .env

# Add logging
import logging
logging.basicConfig(level=logging.DEBUG)

# Check database content
python -c "from app.models.database import *; print(User.query.all())"
```

#### Frontend Debugging
```javascript
// Check API calls in browser console
console.log('API Response:', response);

// Check WebSocket connection
console.log('WebSocket state:', ws.readyState);

// Check authentication state
console.log('Auth token:', localStorage.getItem('token'));
```

### 📞 Getting Help

**🆘 Nếu gặp vấn đề:**
1. Check console logs (F12 in browser)
2. Verify environment variables
3. Check if all services are running
4. Try clearing cache/cookies
5. Restart both frontend and backend

**📝 Báo cáo lỗi:**
- Include error messages
- Steps to reproduce
- Environment details (OS, versions)
- Screenshots if applicable

## 📝 Code Style và Best Practices

### Backend (Python)
```python
# Follow PEP 8
# Use type hints
def create_post(
    post_data: PostCreate,
    current_user: User,
    db: Session
) -> PostResponse:
    pass

# Async/await for I/O operations
async def get_posts(db: Session) -> List[Post]:
    pass

# Proper error handling
try:
    result = await operation()
except SpecificError as e:
    raise HTTPException(status_code=400, detail=str(e))
```

### Frontend (TypeScript)
```typescript
// Use interfaces cho type definitions
interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
}

// Function components với proper typing
const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  // Component logic
};

// Custom hooks cho reusable logic
const useAuth = () => {
  // Hook implementation
};
```

## 📄 License & Contributing

### 📜 License
Dự án này được phát hành dưới giấy phép **MIT License**.

### 🤝 Contributing

Chúng tôi luôn chào đón các contributions! Hãy theo các bước sau:

1. **Fork** repository
2. **Clone** về máy local: `git clone https://github.com/yourname/facebook-simulator.git`
3. Tạo **feature branch**: `git checkout -b feature/AmazingFeature`
4. **Commit** changes: `git commit -m 'Add some AmazingFeature'`
5. **Push** to branch: `git push origin feature/AmazingFeature`
6. Mở **Pull Request**

### 📋 Development Guidelines

#### 🔧 Code Standards
- **Python**: Follow PEP 8, use type hints
- **TypeScript**: Use strict mode, define interfaces
- **CSS**: Use Tailwind utilities, follow BEM convention
- **Git**: Use conventional commits (feat:, fix:, docs:)

#### ✅ Before Contributing
- [ ] Write tests for new features
- [ ] Follow existing code style
- [ ] Update documentation
- [ ] Add proper error handling
- [ ] Ensure responsive design
- [ ] Test on multiple browsers

#### 🧪 Testing
```bash
# Backend tests
cd backend
python -m pytest tests/

# Frontend tests
cd frontend
npm run test

# E2E tests
npm run test:e2e
```

### 🌟 Contributors

Cảm ơn tất cả những người đã đóng góp cho dự án này!

<!-- Contributors will be added here -->

---

## 🎉 Acknowledgments

- **Facebook** - Inspiration for UI/UX design
- **FastAPI** - Amazing Python web framework
- **React** - Powerful UI library
- **Tailwind CSS** - Excellent utility framework
- **Community** - Open source contributors

---

## 📞 Support & Contact

### 🆘 Support
- 📧 **Email**: support@facebook-simulator.com
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourname/facebook-simulator/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourname/facebook-simulator/discussions)

### 📱 Connect
- 🌐 **Website**: https://facebook-simulator.com
- 📘 **Documentation**: https://docs.facebook-simulator.com
- 📺 **Demo**: https://demo.facebook-simulator.com

---

<div align="center">

**🚀 Happy Coding! 🚀**

*Dự án này được xây dựng với ❤️ cho mục đích học tập và demonstration.*

*Không sử dụng cho mục đích thương mại mà không có permission.*

---

**⭐ Nếu project hữu ích, hãy cho chúng tôi 1 star nhé! ⭐**

</div>
