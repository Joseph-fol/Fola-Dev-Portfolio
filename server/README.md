# Portfolio Backend API

Express.js + MongoDB backend for the Windows 12 portfolio website.

## Setup

### Prerequisites
- Node.js 16+
- MongoDB (local or cloud - MongoDB Atlas)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update values:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A strong random string for JWT signing
     - `PORT`: Server port (default: 5000)

3. **Start the server:**
   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

   Server will run on `http://localhost:5000`

## API Endpoints

### Projects (Public)
- `GET /api/projects` - Get all projects (sorted by featured desc, then date desc)
- `GET /api/projects/:id` - Get single project

### Projects (Protected)
- `POST /api/projects` - Create project (requires JWT)
- `PUT /api/projects/:id` - Update project (requires JWT)
- `DELETE /api/projects/:id` - Delete project (requires JWT)

### Authentication
- `POST /api/auth/login` - Login with email/password, returns JWT token
- `POST /api/auth/register` - Register new user account

### Health Check
- `GET /api/health` - Server health status

## Authentication

Protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Project Schema

```javascript
{
  title: String,           // Required
  description: String,
  techStack: [String],
  liveUrl: String,
  repoUrl: String,
  thumbnail: String,       // Image URL
  featured: Boolean,       // Default: false
  createdAt: Date,         // Auto-set
  updatedAt: Date          // Auto-updated
}
```

## User Schema

```javascript
{
  email: String,           // Required, unique
  password: String,        // Required, hashed with bcryptjs
  createdAt: Date,
  updatedAt: Date
}
```

## Example Requests

### Create a Project (Protected)
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Project",
    "description": "A cool project",
    "techStack": ["React", "Tailwind"],
    "liveUrl": "https://example.com",
    "repoUrl": "https://github.com/user/repo"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

## Development

- **Nodemon** is configured for auto-reload during development
- **CORS** is enabled for localhost:5173 (frontend dev server)
- **MongoDB** can run locally or use MongoDB Atlas cloud service

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongod` (local) or use MongoDB Atlas URI
- Check `MONGODB_URI` in `.env`

**JWT Token Errors:**
- Ensure `JWT_SECRET` is set in `.env`
- Include `Authorization: Bearer <token>` header for protected routes

**Port Already in Use:**
- Change `PORT` in `.env` or kill process using port 5000
