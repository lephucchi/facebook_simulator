# Facebook Simulator

Một nền tảng mạng xã hội tương tự Facebook được xây dựng hoàn chỉnh với backend FastAPI (Python) và frontend React (TypeScript).

## Tổng quan dự án

Facebook Simulator là một ứng dụng web full-stack mô phỏng các tính năng chính của Facebook, bao gồm đăng bài, tương tác, chat thời gian thực, và nhiều tính năng xã hội khác. Dự án được thiết kế với kiến trúc hiện đại, có thể mở rộng và dễ bảo trì.

## 🎯 Demo Credentials
- **Username:** john_doe
- **Password:** password123

## 🚀 Khởi động nhanh

### Yêu cầu hệ thống
- Python 3.8+ 
- Node.js 16+
- Git (tùy chọn)

### Backend (Terminal 1)
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

Backend sẽ chạy tại:
- **API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

### Frontend (Terminal 2)
```bash
# Điều hướng đến thư mục frontend
cd frontend

# Cài đặt dependencies (chỉ cần làm một lần)
npm install

# Chạy frontend development server
npm run dev
```

Frontend sẽ chạy tại:
- **App:** http://localhost:5173

## 🏗️ Kiến trúc hệ thống

### Backend (FastAPI + Python)
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
├── main.py               # FastAPI application entry point
├── requirements.txt      # Python dependencies
└── facebook_simulator.db # SQLite database file
```

### Frontend (React + TypeScript)
```
frontend/
├── src/
│   ├── components/       # React components
│   │   ├── chat/        # Chat-related components
│   │   │   ├── ChatWindow.tsx    # Individual chat interface
│   │   │   └── ChatList.tsx      # Chat conversations list
│   │   ├── layout/      # Layout components
│   │   │   ├── Navbar.tsx        # Main navigation bar
│   │   │   ├── Sidebar.tsx       # Left sidebar menu
│   │   │   └── RightSidebar.tsx  # Right sidebar (contacts, etc.)
│   │   ├── newsfeed/    # News feed components
│   │   │   ├── CreatePost.tsx    # Post creation form
│   │   │   ├── PostCard.tsx      # Individual post display
│   │   │   ├── Stories.tsx       # Stories carousel
│   │   │   └── StoryViewer.tsx   # Full-screen story viewer
│   │   └── ui/          # Reusable UI components
│   │       ├── Avatar.tsx        # User avatar component
│   │       ├── Button.tsx        # Custom button component
│   │       └── ReactionPicker.tsx # Post reaction selector
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
├── package.json         # Node.js dependencies
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

## 🚀 Development Setup

### Environment Configuration

#### Backend (.env)
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

#### Frontend (.env)
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

## 🔮 Future Enhancements

### Phase 1: Core Features
- [ ] File upload system cho images/videos
- [ ] Advanced search functionality
- [ ] Notification system
- [ ] User settings page
- [ ] Password reset functionality

### Phase 2: Social Features
- [ ] Friend requests system
- [ ] Groups functionality
- [ ] Events creation và management
- [ ] Photo albums
- [ ] Video calls integration

### Phase 3: Advanced Features
- [ ] AI-powered content recommendation
- [ ] Advanced privacy settings
- [ ] Content moderation tools
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

### Phase 4: Scalability
- [ ] Microservices architecture
- [ ] Redis caching layer
- [ ] CDN integration
- [ ] Load balancing
- [ ] Database sharding

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

## 🐛 Troubleshooting

### Common Issues

#### Backend Issues
```bash
# Port đã được sử dụng
Error: [Errno 48] Address already in use
Solution: Kill process hoặc đổi port trong config.py

# Database locked
Error: database is locked
Solution: Đóng tất cả connections đến database

# Import errors
Error: ModuleNotFoundError
Solution: Activate virtual environment và install dependencies
```

#### Frontend Issues
```bash
# Node modules issues
Error: Module not found
Solution: rm -rf node_modules && npm install

# Port conflicts
Error: Port 5173 is already in use
Solution: npm run dev -- --port 3000

# Build errors
Error: Build failed
Solution: Check TypeScript errors và fix
```

#### WebSocket Issues
```bash
# Connection failed
Error: WebSocket connection failed
Solution: Check backend server running và token valid

# CORS errors
Error: Cross-origin request blocked
Solution: Update CORS settings trong backend
```

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

## 📄 License

Dự án này được phát hành dưới giấy phép MIT License.

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

### Development Guidelines
- Viết tests cho features mới
- Follow code style guidelines
- Update documentation
- Add proper error handling
- Ensure responsive design

## 🆘 Support

Để được hỗ trợ:
1. Mở issue trên GitHub repository
2. Cung cấp detailed error logs
3. Include steps to reproduce
4. Specify environment details

---

**Happy Coding! 🚀**

*Dự án này được xây dựng cho mục đích học tập và demonstration. Không sử dụng cho mục đích thương mại mà không có permission.*
