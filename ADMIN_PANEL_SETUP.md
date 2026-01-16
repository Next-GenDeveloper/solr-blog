# Admin Panel Setup Guide

## Overview
The admin panel has been separated into its own standalone application to prevent session conflicts between user and admin logins. This allows administrators and users to be logged in simultaneously without interfering with each other.

---

## Architecture

### User Panel (Port 3000)
- **Location**: `frontend/`
- **Port**: 3000
- **URL**: http://localhost:3000
- **Purpose**: Public-facing website for customers
- **Features**: Home, Shop, Products, Blog, Contact, User Login/Register

### Admin Panel (Port 3001)
- **Location**: `admin-panel/`
- **Port**: 3001
- **URL**: http://localhost:3001
- **Purpose**: Administrative dashboard for managing the platform
- **Features**: Dashboard, Blogs, Products, Orders, Users, Contacts

### Backend Server (Port 5000)
- **Location**: `backend/`
- **Port**: 5000
- **Purpose**: API server for both user and admin panels

---

## Installation

### First-Time Setup

#### 1. Install Admin Panel Dependencies
```bash
cd admin-panel
npm install
```

#### 2. Configure Environment Variables
The admin panel comes pre-configured with `.env` file:
```env
PORT=3001
REACT_APP_API_URL=http://localhost:5000
REACT_APP_USER_PANEL_URL=http://localhost:3000
```

---

## Running the Application

### Option 1: Run All Services Separately

#### Terminal 1 - Backend Server
```bash
cd backend
npm start
```
Server runs on: http://localhost:5000

#### Terminal 2 - User Panel
```bash
cd frontend
npm start
```
User panel runs on: http://localhost:3000

#### Terminal 3 - Admin Panel
```bash
cd admin-panel
npm start
```
Admin panel runs on: http://localhost:3001

### Option 2: Using Concurrent Scripts (Recommended)

Create a start script in the root directory or use a process manager.

---

## Usage

### Admin Login
1. Open http://localhost:3001
2. Login with admin credentials:
   - Email: admin@solarexpert.com (or your admin email)
   - Password: your admin password
3. Access the full admin dashboard

### User Login
1. Open http://localhost:3000
2. Login with regular user credentials
3. Shop and browse the website

### Simultaneous Access
- ✅ Admin can be logged in on port 3001
- ✅ User can be logged in on port 3000
- ✅ No session conflicts or interference
- ✅ Separate localStorage for each application

---

## Features

### Admin Panel Features
- **Dashboard**: 
  - Professional stats container with colorful header
  - Key Performance Metrics section
  - Interactive stat cards with hover effects
  - Revenue & growth charts
  - Quick actions panel
  - Recent activity feed

- **Blog Management**:
  - Create, edit, delete blog posts
  - Image upload with preview
  - Category and tags management
  - Publish/draft status

- **Product Management**:
  - Add, edit, remove products
  - Image gallery support
  - Stock management
  - Pricing controls

- **Order Management**:
  - View all orders
  - Update order status
  - Track customer orders

- **User Management**:
  - View all users
  - Manage user roles
  - User activity tracking

- **Contact Management**:
  - View contact form submissions
  - Respond to inquiries

---

## Security

### Session Isolation
- Each application maintains its own localStorage
- JWT tokens are stored separately
- No cross-application session conflicts
- Admin and user can be logged in simultaneously

### Authentication
- Admin-only routes protected with ProtectedRoute component
- Automatic redirect to login if not authenticated
- Role-based access control
- Admin credentials required for admin panel

---

## Development

### File Structure
```
admin-panel/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AdminLayout.js
│   │   ├── AdminLayout.css
│   │   └── ProtectedRoute.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── Dashboard.css
│   │   ├── Blogs.js
│   │   ├── Products.js
│   │   ├── Orders.js
│   │   ├── Users.js
│   │   ├── Contacts.js
│   │   ├── AdminPages.css
│   │   ├── Login.js
│   │   └── Login.css
│   ├── App.js
│   ├── index.js
│   └── index.css
├── .env
├── .gitignore
└── package.json
```

### Adding New Admin Features
1. Create new page component in `admin-panel/src/pages/`
2. Add route in `admin-panel/src/App.js`
3. Add menu item in `admin-panel/src/components/AdminLayout.js`
4. Create corresponding backend API if needed

---

## Deployment

### Development Environment
- User Panel: http://localhost:3000
- Admin Panel: http://localhost:3001
- Backend API: http://localhost:5000

### Production Environment

#### Option 1: Separate Domains
- User Panel: https://yourdomain.com
- Admin Panel: https://admin.yourdomain.com
- Backend API: https://api.yourdomain.com

#### Option 2: Separate Ports (Same Domain)
- User Panel: https://yourdomain.com
- Admin Panel: https://yourdomain.com:3001
- Backend API: https://yourdomain.com:5000

#### Option 3: Subpath Routing
- User Panel: https://yourdomain.com
- Admin Panel: https://yourdomain.com/admin-panel
- Backend API: https://yourdomain.com/api

### Build for Production

#### Build Admin Panel
```bash
cd admin-panel
npm run build
```
This creates an optimized production build in `admin-panel/build/`

#### Build User Panel
```bash
cd frontend
npm run build
```
This creates an optimized production build in `frontend/build/`

### Environment Variables for Production

#### Admin Panel (.env.production)
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_USER_PANEL_URL=https://yourdomain.com
```

#### User Panel (.env.production)
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ADMIN_PANEL_URL=https://admin.yourdomain.com
```

---

## Troubleshooting

### Port Already in Use
If port 3001 is already in use:
1. Change PORT in `admin-panel/.env`
2. Update `admin-panel/package.json` start script
3. Restart the application

### Cannot Connect to Backend
- Ensure backend server is running on port 5000
- Check proxy setting in `admin-panel/package.json`
- Verify CORS settings in backend

### Login Not Working
- Clear browser cache and localStorage
- Ensure you're using admin credentials
- Check backend authentication endpoint
- Verify JWT token generation

### Session Conflicts (Should Not Happen)
If you still experience session conflicts:
- Clear all browser data
- Ensure using different ports
- Check that localStorage keys don't conflict
- Verify separate React apps are running

---

## Benefits of Separate Admin Panel

✅ **No Session Conflicts**: Admin and users can be logged in simultaneously
✅ **Better Security**: Admin panel can be deployed on separate domain/server
✅ **Improved Performance**: Smaller bundle sizes for each application
✅ **Independent Scaling**: Scale user and admin panels separately
✅ **Cleaner Code**: Better separation of concerns
✅ **Easier Maintenance**: Isolated codebases for specific purposes
✅ **Flexible Deployment**: Deploy on different servers/domains as needed

---

## Testing

### Test Simultaneous Login
1. Open http://localhost:3000 in Chrome
2. Login as a regular user
3. Open http://localhost:3001 in Firefox (or Chrome Incognito)
4. Login as an admin
5. Both should work independently ✅

### Test Admin Features
1. Access http://localhost:3001
2. Login with admin credentials
3. Test all CRUD operations:
   - Create/edit/delete blogs
   - Manage products
   - View orders
   - Manage users
   - Check contacts

---

## Support

For issues or questions:
1. Check this documentation first
2. Review console logs in browser DevTools
3. Check backend server logs
4. Verify all services are running on correct ports

---

## Summary

The admin panel is now completely separate from the user panel, running on port 3001. This eliminates session conflicts and allows simultaneous admin and user logins. The professional dashboard design includes a beautiful stats section with enhanced visual hierarchy and clear data presentation.

**Quick Start:**
```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd frontend && npm start

# Terminal 3
cd admin-panel && npm start
```

**Access:**
- User Panel: http://localhost:3000
- Admin Panel: http://localhost:3001

Enjoy your conflict-free admin and user experience! 🎉
