# Developer Portfolio - Windows 12 UI

A full-stack portfolio website styled entirely after the Windows 12 concept UI, featuring a glassmorphism desktop environment, floating draggable widgets, colorful 3D ribbon wallpaper, and responsive mobile layout.

## 🎨 Features

- **Windows 12-Inspired Design**: Glassmorphism effects, gradient backgrounds, and ribbons wallpaper
- **Interactive Widgets**: Draggable (desktop) / stackable (mobile) panels for About, Projects, Skills, Contact, and GitHub
- **Responsive Layout**: Desktop with floating windows, mobile with vertical card stack and bottom navigation (md: 768px breakpoint)
- **Admin Dashboard**: Secure project management with JWT authentication
- **Live Integrations**:
  - GitHub API for real-time repository and activity data
  - Contact form with email validation and toast notifications
  - Project showcase with admin CRUD operations
- **Full-Stack**: React 18 + Vite frontend, Express backend with MongoDB
- **Dark Mode**: Toggle-able dark theme with localStorage persistence
- **Keyboard Shortcuts**: Press `/` or `Cmd/Ctrl+/` to toggle Start Menu

## 📋 Requirements

- Node.js 16.x or higher
- MongoDB (local or cloud URI like MongoDB Atlas)
- npm or yarn package manager

## 🚀 Local Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MY\ PROJECT\ PORTFOLIO
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file with required variables
cat > .env << 'EOF'
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long_please
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
EOF

# Start the server
npm start
```

**Server runs on**: http://localhost:5000

**Health check**: http://localhost:5000/api/health

### 3. Frontend Setup

```bash
cd ../client

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
VITE_API_URL=http://localhost:5000/api
EOF

# Start development server
npm run dev
```

**Frontend runs on**: http://localhost:5173

The frontend is configured to proxy API calls to the backend automatically via Vite's proxy middleware.

## 🔐 Environment Variables Guide

### Backend (.env)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGODB_URI` | ✅ | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/portfolio` |
| `JWT_SECRET` | ✅ | Secret key for signing JWT tokens (minimum 32 characters) | `your_secret_key_min_32_characters_long` |
| `PORT` | ❌ | Server port (defaults to 5000) | `5000` |
| `NODE_ENV` | ❌ | Environment mode | `development` or `production` |
| `CORS_ORIGIN` | ❌ | Allowed CORS origin for frontend | `http://localhost:5173` |

### Frontend (.env)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | ✅ | Backend API base URL (without trailing slash) | `http://localhost:5000/api` |

## 📁 Project Structure

```
MY PROJECT PORTFOLIO/
├── server/
│   ├── models/
│   │   ├── User.js          # User schema with password hashing
│   │   ├── Project.js       # Project schema (title, description, tech, urls)
│   │   └── Message.js       # Contact message schema
│   ├── routes/
│   │   ├── projects.js      # GET, POST, PUT, DELETE /api/projects
│   │   ├── auth.js          # POST /api/auth/login, register
│   │   └── contact.js       # POST /api/contact
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── .env                 # Environment variables
│   ├── .env.example         # Template for .env
│   ├── server.js            # Express server entry point
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Desktop.jsx        # Main desktop environment
│   │   │   ├── LockScreen.jsx     # Boot screen with clock
│   │   │   ├── Widget.jsx         # Reusable draggable widget wrapper
│   │   │   ├── MobileNav.jsx      # Mobile bottom navigation tabs
│   │   │   ├── Taskbar.jsx        # Desktop bottom taskbar
│   │   │   ├── StartMenu.jsx      # Windows-style start menu
│   │   │   ├── ContextMenu.jsx    # Right-click context menu
│   │   │   ├── ProtectedRoute.jsx # Auth-protected route wrapper
│   │   │   ├── ToasterProvider.jsx# Toast notification setup
│   │   │   └── widgets/
│   │   │       ├── AboutWidget.jsx
│   │   │       ├── ProjectsWidget.jsx
│   │   │       ├── SkillsWidget.jsx
│   │   │       ├── ContactWidget.jsx
│   │   │       └── GitHubWidget.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Authentication page
│   │   │   └── Admin.jsx          # Admin dashboard for project management
│   │   ├── hooks/
│   │   │   ├── useClock.js        # Live time updates
│   │   │   ├── useProjects.js     # Fetch projects from API
│   │   │   ├── useGitHub.js       # Fetch GitHub data
│   │   │   └── usePageTitle.js    # Dynamic document.title updates
│   │   ├── context/
│   │   │   └── WindowContext.jsx  # Global widget state management
│   │   ├── config.js              # App configuration (GitHub username, etc)
│   │   ├── App.jsx                # Root component with routing & keyboard shortcuts
│   │   └── main.jsx               # React DOM mount point
│   ├── public/
│   │   └── favicon.svg            # Windows 12 grid logo (2x2 colored squares)
│   ├── index.html                 # HTML entry point
│   ├── .env                       # Environment variables
│   ├── .env.example               # Template for .env
│   ├── vercel.json                # Vercel deployment config (SPA rewrites)
│   ├── vite.config.js             # Vite build config with proxy
│   ├── tailwind.config.js         # Tailwind CSS theme customization
│   ├── postcss.config.js          # PostCSS for Tailwind
│   └── package.json
│
├── README.md                      # This file
└── .gitignore
```

## 🔌 API Endpoints Reference

### Public Endpoints

```
GET  /api/health                    # Server health check
GET  /api/projects                  # Fetch all projects
GET  /api/projects/:id              # Fetch single project by ID
POST /api/contact                   # Submit contact form message
```

### Authentication Endpoints

```
POST /api/auth/login                # Login with email + password
POST /api/auth/register             # Register new user account
```

**Request example**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response example**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "email": "user@example.com"
  }
}
```

### Protected Endpoints (Requires JWT)

All requests must include:
```
Authorization: Bearer <your_jwt_token>
```

```
POST   /api/projects                # Create new project
PUT    /api/projects/:id            # Update project
DELETE /api/projects/:id            # Delete project
```

**Example Create Project**:
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Project",
    "description": "A cool project",
    "techStack": ["React", "Node.js", "MongoDB"],
    "liveUrl": "https://example.com",
    "repoUrl": "https://github.com/user/project",
    "thumbnail": "https://example.com/image.jpg",
    "featured": true
  }'
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library with hooks
- **Vite 4.3.9** - Fast build tool & dev server
- **Tailwind CSS 3** - Utility-first CSS framework
- **Framer Motion 10** - Smooth animations & transitions
- **React Router v6** - Client-side routing
- **Axios** - Promise-based HTTP client
- **React Hot Toast** - Toast notifications
- **Tabler Icons** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express 4** - Web application framework
- **Mongoose** - MongoDB ODM
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

## 🎯 Key Configurations

### Vite Configuration (client/vite.config.js)
- Proxy setup: `/api` routes forward to backend
- React plugin with Fast Refresh
- Hot Module Replacement (HMR) enabled
- Build optimization for production

### Tailwind Configuration (client/tailwind.config.js)
Extended colors:
- Primary Blue: `#1a3870`
- Accent Blue: `#1a6ef5`
- Pink: `#e050a0`
- Glass Effect: `rgba(230, 242, 255, 0.75)`

### Database Models

**User**
```javascript
{
  email: String (unique, lowercase, required),
  password: String (hashed with bcryptjs, required)
}
```

**Project**
```javascript
{
  title: String (required),
  description: String,
  techStack: [String],
  liveUrl: String,
  repoUrl: String,
  thumbnail: String (image URL),
  featured: Boolean (default: false),
  createdAt: Date (auto-created),
  updatedAt: Date (auto-updated)
}
```

**Message**
```javascript
{
  name: String (required),
  email: String (required, validated),
  message: String (required, min 10 chars),
  read: Boolean (default: false),
  createdAt: Date (auto-created),
  updatedAt: Date (auto-updated)
}
```

## 📱 Responsive Breakpoints

Using Tailwind CSS responsive prefixes:

- **Mobile (< 768px)**
  - Widgets displayed as full-width card stack
  - MobileNav bottom navigation bar with 5 tabs
  - SVG ribbons hidden
  - No dragging, scrollable layout
  - Touch-friendly interactions

- **Tablet & Desktop (≥ 768px)**
  - Floating draggable widgets
  - Taskbar at bottom with system tray
  - Start Menu & Context Menu
  - SVG ribbon wallpaper visible
  - Full desktop experience

## 🔐 Authentication & Security

### Password Security
- Passwords hashed with bcryptjs (salt rounds: 10)
- Never sent in API responses
- `select: false` in User schema to exclude from queries

### JWT Tokens
- Generated on login/register
- Signed with `JWT_SECRET` environment variable
- Expires in 7 days (`7d`)
- Stored in browser localStorage
- Sent in `Authorization: Bearer <token>` header

### Protected Routes
- `/admin` protected by ProtectedRoute component
- Checks for valid token in localStorage
- Redirects unauthenticated users to `/login`

## 🚢 Deployment Guides

### Frontend Deployment (Vercel)

1. **Push code to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Set Environment Variables** in Vercel Dashboard:
   - `VITE_API_URL`: `https://your-api-domain.com/api`

4. **Deploy**: Click "Deploy"

**Configuration file**: `client/vercel.json` handles SPA routing with rewrites.

### Backend Deployment (Render)

1. **Sign up** at https://render.com

2. **Create Web Service**:
   - Connect GitHub repository
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free or Starter

3. **Set Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio
   JWT_SECRET=your_very_long_secret_key_32_chars_minimum
   NODE_ENV=production
   CORS_ORIGIN=https://your-vercel-domain.vercel.app
   ```

4. **Deploy**: Render auto-deploys on push to main

### Backend Deployment (Alternative: Railway)

1. **Sign up** at https://railway.app

2. **Create Project** → Connect GitHub

3. **Add Environment Variables** (same as above)

4. **Deploy**: Railway auto-builds and deploys

## 🎮 Usage Guide

### Desktop Features
- **Dragging Widgets**: Click and drag any widget by its header
- **Focusing**: Click widget to bring to front
- **Closing**: Click × button to close widget
- **Dark Mode**: Right-click background → "Personalize"
- **Start Menu**: Click Windows icon or press `/`
- **Clock**: Centered at top, updates every second

### Mobile Features
- **Bottom Navigation**: 5 tabs (About, Projects, Skills, Contact, GitHub)
- **Scrolling**: Vertical scroll through card stack
- **Tap to Switch**: Tap tab icon to switch between sections
- **No Dragging**: Widgets are static cards on mobile

### Admin Dashboard
- **Access**: `/login` → Enter email/password → `/admin`
- **Create Project**: Fill form and click "Create Project"
- **Edit Project**: Click Edit button, modify form, click "Update Project"
- **Delete Project**: Click Delete button, confirm in dialog
- **Logout**: Click Logout button, redirected to login

## 🐛 Common Issues & Solutions

### MongoDB Connection Error
```
✗ MongoDB connection error: getaddrinfo ENOTFOUND localhost
```
**Solution**: Ensure MongoDB is running locally or update `MONGODB_URI` with correct cloud URI.

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Check:
1. `CORS_ORIGIN` in server `.env` matches frontend URL
2. `VITE_API_URL` in client `.env` is correct
3. Backend server is running

### API 404 Errors
**Solution**: Ensure routes are mounted at `/api` in server.js:
```javascript
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
```

### Widgets Not Showing on Desktop
**Solution**:
1. Check browser console for errors
2. Ensure `WindowContext` provider wraps Desktop
3. Clear localStorage: `localStorage.clear()`
4. Verify window state in DevTools: `localStorage.getItem('windowState')`

### JWT Token Expired
**Solution**: Tokens expire in 7 days. Users must log in again. For dev, extend in `auth.js`:
```javascript
const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' });
```

## 📚 Code Examples

### Using Toast Notifications
```javascript
import toast from 'react-hot-toast';

// Success
toast.success('Project created successfully!');

// Error
toast.error('Failed to save project');

// Custom
toast('Custom message', {
  icon: '🎉',
  duration: 3000,
});
```

### Using Dynamic Page Title
```javascript
import usePageTitle from '../../hooks/usePageTitle';

export default function MyWidget() {
  usePageTitle('projects', 'Projects'); // Sets: "Projects | Developer Portfolio"
  // ...
}
```

### API Call with JWT
```javascript
import axios from 'axios';

const token = localStorage.getItem('authToken');

await axios.post(
  `${API_URL}/projects`,
  projectData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
```

## 🎨 Customization

### Update Portfolio Info
Edit `client/src/config.js`:
```javascript
export const CONFIG = {
  github: {
    username: 'your-github-username', // Change to your GitHub username
  },
  // Add more config as needed
};
```

Edit `client/src/components/widgets/AboutWidget.jsx`:
```javascript
const DEVELOPER_INFO = {
  name: 'Your Name',
  role: 'Your Role',
  bio: 'Your bio...',
  // ... etc
};
```

### Change Color Scheme
Edit `client/tailwind.config.js` to modify the color theme throughout the app.

## 📖 Documentation Links

- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://docs.mongodb.com/)
- [JWT Auth](https://jwt.io/introduction)

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Coding! 🚀**
