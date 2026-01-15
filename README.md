# Solar Expert - Comprehensive Solar Energy Website

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing solar energy products, blogs, and services. Features a modern, animated frontend with a powerful admin panel for content management.

![Solar Expert](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

### Public Features
- **Landing Page**: Modern, animated homepage with hero section and featured content
- **Product Shop**: Browse, search, and filter solar products with detailed product pages
- **Blog System**: Read articles about solar energy with categories and search
- **Contact Form**: Easy-to-use contact form for customer inquiries
- **Service Provider**: Information about installation and maintenance services
- **Authentication**: Secure user registration and login with JWT tokens
- **Responsive Design**: Fully responsive across all devices

### Admin Features (Admin Panel at `/admin`)
- **Dashboard**: Overview with statistics and activity charts
- **Blog Management**: Create, edit, delete, and publish blog posts
- **Product Management**: Full CRUD operations for products with inventory tracking
- **Order Management**: View and manage customer orders with status updates
- **User Management**: View users, their activity, and login history
- **Contact Management**: Review and respond to customer inquiries

## 🚀 Tech Stack

### Frontend
- **React 18**: Modern React with hooks
- **React Router v6**: Client-side routing
- **Framer Motion**: Beautiful animations and transitions
- **Axios**: HTTP client for API calls
- **React Toastify**: Toast notifications
- **React Icons**: Icon library
- **Recharts**: Data visualization for admin dashboard

### Backend
- **Node.js & Express**: Server and API
- **MongoDB & Mongoose**: Database and ODM
- **JWT**: Authentication tokens
- **Bcrypt**: Password hashing
- **Multer**: File upload handling
- **Express Validator**: Input validation

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd solar-expert
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration
# Required environment variables:
# - PORT=5000
# - MONGODB_URI=mongodb://localhost:27017/solarexpert
# - JWT_SECRET=your_super_secret_jwt_key_change_in_production
# - JWT_EXPIRE=30d
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

### 4. Create Initial Admin User

You need to create an admin user manually in MongoDB:

```javascript
// Connect to MongoDB and run this in MongoDB shell or Compass:
use solarexpert

db.users.insertOne({
  name: "Admin User",
  email: "admin@solarexpert.com",
  password: "$2a$10$YourHashedPasswordHere", // Use bcrypt to hash "admin123" or your password
  role: "admin",
  phone: "",
  isActive: true,
  loginHistory: [],
  createdAt: new Date()
})
```

Or use this Node.js script to create admin user:

```javascript
// create-admin.js in backend folder
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/solarexpert');

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@solarexpert.com',
    password: hashedPassword,
    role: 'admin',
    phone: '555-0000',
  });
  
  console.log('Admin created:', admin.email);
  process.exit();
}

createAdmin();
```

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Frontend runs on http://localhost:3000
```

### Production Mode

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Run Backend:**
```bash
cd backend
NODE_ENV=production npm start
```

## 📁 Project Structure

```
solar-expert/
├── backend/
│   ├── models/          # MongoDB schemas
│   │   ├── User.js
│   │   ├── Blog.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Contact.js
│   ├── routes/          # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── blogs.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── contact.js
│   ├── middleware/      # Custom middleware
│   │   ├── auth.js
│   │   └── upload.js
│   ├── uploads/         # Uploaded files
│   ├── server.js        # Express server
│   └── package.json
│
└── frontend/
    ├── public/
    │   ├── index.html
    │   └── manifest.json
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── Footer.js
    │   │   ├── ProtectedRoute.js
    │   │   └── admin/
    │   │       └── AdminLayout.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── About.js
    │   │   ├── Shop.js
    │   │   ├── ProductDetail.js
    │   │   ├── Blog.js
    │   │   ├── BlogDetail.js
    │   │   ├── Contact.js
    │   │   ├── ServiceProvider.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   └── admin/
    │   │       ├── Dashboard.js
    │   │       ├── Blogs.js
    │   │       ├── Products.js
    │   │       ├── Orders.js
    │   │       ├── Users.js
    │   │       └── Contacts.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updateprofile` - Update user profile

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Blogs
- `GET /api/blogs` - Get published blogs (Public)
- `GET /api/blogs/all` - Get all blogs (Admin)
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create blog (Admin)
- `PUT /api/blogs/:id` - Update blog (Admin)
- `DELETE /api/blogs/:id` - Delete blog (Admin)

### Products
- `GET /api/products` - Get active products (Public)
- `GET /api/products/all` - Get all products (Admin)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status (Admin)
- `DELETE /api/orders/:id` - Delete order (Admin)

### Contact
- `POST /api/contact` - Submit contact form (Public)
- `GET /api/contact` - Get all contacts (Admin)
- `PUT /api/contact/:id` - Update contact status (Admin)
- `DELETE /api/contact/:id` - Delete contact (Admin)

## 🎨 Design Features

- **Modern UI**: Clean, professional design with gradient accents
- **Animations**: Smooth Framer Motion animations throughout
- **Responsive**: Mobile-first design that works on all screen sizes
- **Dark Sidebar**: Professional admin panel with dark-themed sidebar
- **Toast Notifications**: User-friendly feedback for all actions
- **Loading States**: Skeleton screens and spinners for better UX

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes (client and server-side)
- Admin-only endpoints
- Input validation
- CORS configuration
- Secure HTTP headers

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 968px
- Desktop: > 968px

## 🎯 Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Advanced search and filters
- [ ] Wishlist functionality
- [ ] Order tracking system
- [ ] PDF invoice generation
- [ ] Social media sharing
- [ ] Multi-language support
- [ ] Dark mode toggle

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
# Windows:
net start MongoDB

# macOS/Linux:
sudo systemctl start mongod
```

### Port Already in Use
```bash
# Change port in backend/.env
PORT=5001

# Or kill the process using the port (example for port 5000)
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9
```

### CORS Issues
Make sure your backend is running and the frontend proxy is configured correctly in `frontend/package.json`:
```json
"proxy": "http://localhost:5000"
```

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Created with ❤️ for a sustainable future.

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the powerful database
- Framer Motion for beautiful animations
- All open-source contributors

## 📞 Support

For support, email info@solarexpert.com or create an issue in the repository.

---

**Happy Coding! ☀️**
