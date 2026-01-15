# Solar Expert - Quick Setup Guide

This guide will help you get the Solar Expert website up and running in minutes.

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Prerequisites

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/
   - Choose LTS version (recommended)
   - Verify installation: `node --version` and `npm --version`

2. **Install MongoDB** (if not already installed)
   - Download from: https://www.mongodb.com/try/download/community
   - Install with default settings
   - MongoDB will start automatically after installation

### Step 2: Setup Backend

Open a terminal and run:

```bash
# Navigate to backend directory
cd backend

# Install all required packages
npm install

# Create environment configuration
echo "PORT=5000
MONGODB_URI=mongodb://localhost:27017/solarexpert
JWT_SECRET=solar_expert_super_secret_key_2024_change_in_production
JWT_EXPIRE=30d
NODE_ENV=development" > .env

# Create uploads directory structure
mkdir -p uploads/blogs uploads/products uploads/users
```

### Step 3: Setup Frontend

Open a **NEW** terminal window and run:

```bash
# Navigate to frontend directory
cd frontend

# Install all required packages
npm install
```

### Step 4: Create Admin User

Run this script to create an admin user:

```bash
# In backend directory
cd backend

# Create admin-setup.js file
echo "const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/solarexpert');

async function createAdmin() {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@solarexpert.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit();
    }

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@solarexpert.com',
      password: 'admin123',
      role: 'admin',
      phone: '555-0000',
      isActive: true
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@solarexpert.com');
    console.log('Password: admin123');
    console.log('');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
    process.exit();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createAdmin();" > admin-setup.js

# Run the script
node admin-setup.js
```

### Step 5: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
You should see: `Server is running on port 5000` and `MongoDB Connected Successfully`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Your browser will automatically open to `http://localhost:3000`

## 🎉 You're All Set!

### Default Admin Credentials:
- **Email**: admin@solarexpert.com
- **Password**: admin123

### Important URLs:
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Backend API**: http://localhost:5000/api

## 📝 What to Do Next

1. **Login as Admin**
   - Go to http://localhost:3000/login
   - Use the admin credentials above
   - Change your password in the profile settings

2. **Add Sample Content**
   - Go to Admin Panel (click on your name → Admin Panel)
   - Add some products in Products section
   - Create blog posts in Blogs section

3. **Test User Registration**
   - Logout from admin account
   - Register a new user account
   - Test the public features

## 🔧 Common Issues & Solutions

### Issue: "MongoDB connection error"
**Solution:**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Issue: "Port 5000 already in use"
**Solution:** Change the port in `backend/.env`:
```
PORT=5001
```

### Issue: "Cannot find module"
**Solution:** Reinstall dependencies:
```bash
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Frontend not connecting to backend
**Solution:** Make sure both servers are running and check `frontend/package.json` has:
```json
"proxy": "http://localhost:5000"
```

## 📊 Testing the Application

### Test Public Features:
1. ✅ Browse products on Shop page
2. ✅ Read blog posts
3. ✅ Submit contact form
4. ✅ Register new user account
5. ✅ Login/Logout

### Test Admin Features:
1. ✅ Access admin panel at /admin
2. ✅ View dashboard statistics
3. ✅ Create/Edit/Delete blogs
4. ✅ Create/Edit/Delete products
5. ✅ View and manage users
6. ✅ View contact messages

## 🎨 Customization Tips

### Change Colors:
Edit `frontend/src/index.css` - look for CSS variables:
```css
:root {
  --primary-color: #ff6b35;  /* Change this */
  --secondary-color: #f7931e; /* And this */
}
```

### Change Logo:
Replace the sun emoji (☀️) in:
- `frontend/src/components/Navbar.js`
- `frontend/src/components/Footer.js`
- `frontend/src/components/admin/AdminLayout.js`

### Add Your Images:
- Products: Upload via Admin Panel → Products
- Blogs: Upload via Admin Panel → Blogs
- Background: Update CSS in respective component files

## 📚 Additional Resources

- **MongoDB Docs**: https://docs.mongodb.com/
- **React Docs**: https://react.dev/
- **Express Docs**: https://expressjs.com/
- **Framer Motion**: https://www.framer.com/motion/

## 💡 Pro Tips

1. **Use MongoDB Compass** for easier database management
   - Download: https://www.mongodb.com/products/compass

2. **Install React Developer Tools** for debugging
   - Chrome: https://chrome.google.com/webstore
   - Search for "React Developer Tools"

3. **Use Postman** to test API endpoints
   - Download: https://www.postman.com/downloads/

## 🆘 Need Help?

If you encounter any issues:
1. Check the console logs (both frontend and backend terminals)
2. Verify all services are running (MongoDB, Backend, Frontend)
3. Make sure all npm packages are installed
4. Check the main README.md for detailed documentation

---

**Congratulations! Your Solar Expert website is now running! 🌟**
