# Quick Start - All Services

## 🚀 Starting All Services

### Manual Start (Recommended for Development)

Open **3 separate terminals** and run:

#### Terminal 1 - Backend API
```bash
cd backend
npm start
```
✅ Backend running on: http://localhost:5000

#### Terminal 2 - User Panel
```bash
cd frontend
npm start
```
✅ User Panel running on: http://localhost:3000

#### Terminal 3 - Admin Panel
```bash
cd admin-panel
npm install  # First time only
npm start
```
✅ Admin Panel running on: http://localhost:3001

---

## 📋 Access URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **User Panel** | http://localhost:3000 | Public website for customers |
| **Admin Panel** | http://localhost:3001 | Administrative dashboard |
| **Backend API** | http://localhost:5000 | REST API server |

---

## 🔐 Login Credentials

### Admin Login (Port 3001)
- Navigate to: http://localhost:3001
- Use your admin credentials
- Access full admin dashboard

### User Login (Port 3000)
- Navigate to: http://localhost:3000/login
- Use regular user credentials
- Browse and shop

---

## ✅ Verification Checklist

After starting all services, verify:

- [ ] Backend API is running on port 5000
- [ ] User Panel opens at http://localhost:3000
- [ ] Admin Panel opens at http://localhost:3001
- [ ] Can login to User Panel
- [ ] Can login to Admin Panel
- [ ] Both panels work simultaneously without conflicts
- [ ] Admin dashboard shows stats and charts
- [ ] User panel displays products and blogs

---

## 🎯 Key Features

### Admin Panel (Port 3001)
✨ **New Professional Stats Section**
- Beautiful container design with colorful gradient header
- "Key Performance Metrics" title section
- Enhanced stat cards with animations
- Larger icons (70px) with shine effects
- Gradient trend badges
- Hover effects with radial gradients
- Click-to-navigate functionality

📊 **Dashboard Features**
- Real-time statistics
- Revenue & growth charts
- Quick action buttons
- Recent activity feed

🛠️ **Management Tools**
- Blog creation with image upload
- Product management
- Order tracking
- User administration
- Contact form management

### User Panel (Port 3000)
🏠 Public website features
🛍️ Product browsing and shopping
📝 Blog reading
📧 Contact forms
👤 User registration and login

---

## 🐛 Troubleshooting

### Port Already in Use
If you get "port already in use" error:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### Admin Panel Not Starting
```bash
cd admin-panel
rm -rf node_modules package-lock.json
npm install
npm start
```

### Cannot Access Services
- Check if all services are running
- Verify firewall settings
- Clear browser cache
- Try incognito/private mode

---

## 📦 First Time Setup

If this is your first time running the admin panel:

```bash
# Install admin panel dependencies
cd admin-panel
npm install

# Return to root
cd ..

# Start all services (open 3 terminals)
# Terminal 1: cd backend && npm start
# Terminal 2: cd frontend && npm start  
# Terminal 3: cd admin-panel && npm start
```

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ No error messages in any terminal
✅ Browser automatically opens both ports
✅ Admin panel shows the beautiful gradient header
✅ Stats section displays with professional design
✅ Can navigate all admin pages
✅ Can create/edit content
✅ User panel loads normally
✅ No session conflicts between panels

---

## 📝 Notes

- **Session Isolation**: Admin and user sessions are completely separate
- **Simultaneous Login**: You can be logged in as admin and user at the same time
- **Data Sync**: Both panels use the same backend database
- **Independent**: Each panel can be deployed separately

---

## 🆘 Need Help?

Refer to:
- `ADMIN_PANEL_SETUP.md` - Comprehensive setup guide
- `README.md` - General project information
- Backend logs in Terminal 1
- Frontend logs in Terminal 2
- Admin panel logs in Terminal 3

---

**Happy Managing! 🚀**
