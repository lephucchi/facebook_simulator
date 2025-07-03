# Facebook Simulator

🚀 Một nền tảng mạng xã hội tương tự Facebook được xây dựng với FastAPI (Python) và React (TypeScript).

## 🎯 Tính năng chính

- 📝 **Đăng bài và tương tác**: Tạo post, reactions (like, love, haha, wow, angry), comment
- 💬 **Chat thời gian thực**: Tin nhắn real-time với WebSocket
- 📖 **Stories**: Chia sẻ khoảnh khắc tạm thời (24h)
- 🔐 **Authentication**: Đăng ký/đăng nhập với JWT
- 👥 **Quản lý người dùng**: Profile, avatar, online status
- 📱 **Responsive Design**: Tương thích với mọi thiết bị

## 🎯 Demo Account
- **Username:** john_doe
- **Password:** password123

## 🚀 Khởi động nhanh

### Yêu cầu hệ thống
- Python 3.8+
- Node.js 16+

### Cài đặt và chạy

#### 1. Backend (Terminal 1)
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
python main.py
```

**Backend chạy tại:** http://localhost:8000

#### 2. Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

**Frontend chạy tại:** http://localhost:5173

## 🔧 Tech Stack

**Backend:**
- FastAPI - Modern Python web framework
- SQLAlchemy - ORM
- JWT - Authentication
- WebSocket - Real-time communication
- SQLite - Database

**Frontend:**
- React 19 - UI library
- TypeScript - Type-safe JavaScript
- Tailwind CSS - CSS framework
- Vite - Build tool

## 📂 Cấu trúc dự án

```
facebook_simulator/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Core functionality
│   │   ├── models/       # Database models
│   │   └── services/     # Business logic
│   ├── main.py           # FastAPI entry point
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   └── utils/        # Utilities
│   ├── package.json      # Node dependencies
│   └── vite.config.ts    # Vite config
└── README.md
```

## 🌟 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Thông tin user

### Posts
- `GET /api/posts` - Lấy danh sách bài viết
- `POST /api/posts` - Tạo bài viết mới
- `POST /api/posts/{id}/reactions` - Thêm/xóa reaction
- `POST /api/posts/{id}/comments` - Tạo comment

### Messages
- `GET /api/messages/chats` - Danh sách chat
- `GET /api/messages/{user_id}` - Tin nhắn với user
- `POST /api/messages/{user_id}` - Gửi tin nhắn

### Stories
- `GET /api/stories` - Lấy stories active
- `POST /api/stories/{id}/view` - Xem story

### WebSocket
- `WS /ws?token={jwt_token}` - Kết nối real-time

*Dự án được xây dựng cho mục đích học tập và demonstration.*
