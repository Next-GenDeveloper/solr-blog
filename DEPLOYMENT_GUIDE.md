# Solar Expert - Complete Deployment Guide

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Deployment Methods](#deployment-methods)
4. [Production Deployment](#production-deployment)
5. [Web Server Configuration](#web-server-configuration)
6. [SSL Configuration](#ssl-configuration)
7. [Process Management](#process-management)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js**: v16.x or higher
- **npm**: v8.x or higher
- **MongoDB**: v4.4 or higher
- **Web Server**: nginx (recommended) or Apache
- **Process Manager**: PM2 (recommended)
- **SSL Certificate**: Let's Encrypt (free) or commercial

### Server Requirements
- **Minimum**: 2 CPU cores, 4GB RAM, 20GB storage
- **Recommended**: 4 CPU cores, 8GB RAM, 50GB storage
- **Operating System**: Ubuntu 20.04/22.04, CentOS 8, or Windows Server

---

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-repo/solar-expert.git
cd solar-expert
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend (User Panel):**
```bash
cd ../frontend
npm install
```

**Admin Panel:**
```bash
cd ../admin-panel
npm install
```

### 3. Configure Environment Variables

Copy the example files and configure them:

**Backend:**
```bash
cd backend
cp .env.production.example .env
# Edit .env with your production values
```

**Frontend:**
```bash
cd ../frontend
cp .env.production.example .env.production
# Edit .env.production with your values
```

**Admin Panel:**
```bash
cd ../admin-panel
cp .env.production.example .env.production
# Edit .env.production with your values
```

---

## Deployment Methods

### Method 1: Automated Deployment Script

**Windows:**
```powershell
# Deploy all applications
.\deploy.ps1 -Target all

# Deploy specific application
.\deploy.ps1 -Target backend
.\deploy.ps1 -Target frontend
.\deploy.ps1 -Target admin

# Skip build (if already built)
.\deploy.ps1 -Target all -SkipBuild

# Skip tests
.\deploy.ps1 -Target all -SkipTests
```

**Linux/Mac:**
```bash
# Make script executable
chmod +x deploy.sh

# Deploy all applications
./deploy.sh --target all

# Deploy specific application
./deploy.sh --target backend
./deploy.sh --target frontend
./deploy.sh --target admin

# Skip build
./deploy.sh --target all --skip-build

# Skip tests
./deploy.sh --target all --skip-tests
```

### Method 2: Manual Deployment

**Backend:**
```bash
cd backend
npm ci --production
```

**Frontend:**
```bash
cd frontend
npm ci
npm run build
# Output: frontend/build/
```

**Admin Panel:**
```bash
cd admin-panel
npm ci
npm run build
# Output: admin-panel/build/
```

---

## Production Deployment

### Step 1: Setup MongoDB

**Local Installation:**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Cloud MongoDB (Atlas):**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update MONGODB_URI in backend/.env

### Step 2: Build Applications

```bash
# Build frontend
cd frontend
npm run build

# Build admin panel
cd ../admin-panel
npm run build
```

### Step 3: Deploy Files

**Option A: Copy to Web Server Directory**
```bash
# Copy user panel
sudo cp -r frontend/build/* /var/www/solar-expert/frontend/

# Copy admin panel
sudo cp -r admin-panel/build/* /var/www/solar-expert/admin-panel/

# Set permissions
sudo chown -R www-data:www-data /var/www/solar-expert
```

**Option B: Use Symbolic Links**
```bash
sudo ln -s /path/to/solar-expert/frontend/build /var/www/frontend
sudo ln -s /path/to/solar-expert/admin-panel/build /var/www/admin
```

---

## Web Server Configuration

### Nginx Configuration

1. **Copy example configuration:**
```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/solar-expert
```

2. **Update domains in the file:**
```bash
sudo nano /etc/nginx/sites-available/solar-expert
```
Replace:
- `yourdomain.com` with your actual domain
- `admin.yourdomain.com` with your admin subdomain
- `/var/www/solar-expert/` with your actual path

3. **Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/solar-expert /etc/nginx/sites-enabled/
```

4. **Test configuration:**
```bash
sudo nginx -t
```

5. **Reload nginx:**
```bash
sudo systemctl reload nginx
```

### Apache Configuration

```apache
# User Panel - /etc/apache2/sites-available/yourdomain.conf
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /var/www/solar-expert/frontend/build
    
    <Directory /var/www/solar-expert/frontend/build>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # React Router
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # API Proxy
    ProxyPass /api http://localhost:5000/api
    ProxyPassReverse /api http://localhost:5000/api
</VirtualHost>

# Admin Panel - /etc/apache2/sites-available/admin.conf
<VirtualHost *:80>
    ServerName admin.yourdomain.com
    DocumentRoot /var/www/solar-expert/admin-panel/build
    
    <Directory /var/www/solar-expert/admin-panel/build>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # React Router
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # API Proxy
    ProxyPass /api http://localhost:5000/api
    ProxyPassReverse /api http://localhost:5000/api
</VirtualHost>
```

Enable sites:
```bash
sudo a2ensite yourdomain
sudo a2ensite admin
sudo a2enmod rewrite proxy proxy_http
sudo systemctl reload apache2
```

---

## SSL Configuration

### Using Let's Encrypt (Free)

1. **Install Certbot:**
```bash
# Ubuntu/Debian
sudo apt-get install certbot python3-certbot-nginx
```

2. **Obtain Certificate:**
```bash
# For nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d admin.yourdomain.com

# For Apache
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com -d admin.yourdomain.com
```

3. **Auto-renewal:**
```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically sets up cron job for renewal
```

---

## Process Management

### Using PM2

1. **Install PM2:**
```bash
sudo npm install -g pm2
```

2. **Start Backend:**
```bash
pm2 start ecosystem.config.js --env production
```

3. **PM2 Commands:**
```bash
pm2 list                           # List all processes
pm2 logs solar-expert-backend      # View logs
pm2 restart solar-expert-backend   # Restart
pm2 stop solar-expert-backend      # Stop
pm2 delete solar-expert-backend    # Delete
pm2 monit                          # Monitor
```

4. **Setup Auto-start:**
```bash
pm2 save
pm2 startup
# Follow the instructions printed by the command
```

### Using systemd (Alternative)

Create service file: `/etc/systemd/system/solar-expert.service`
```ini
[Unit]
Description=Solar Expert Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/solar-expert/backend
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable solar-expert
sudo systemctl start solar-expert
sudo systemctl status solar-expert
```

---

## Monitoring & Maintenance

### Health Checks

**Backend Health Endpoint:**
```bash
curl http://localhost:5000/api/health
```

**Check PM2 Status:**
```bash
pm2 status
pm2 monit
```

### Log Management

**PM2 Logs:**
```bash
pm2 logs
pm2 logs --lines 100
```

**Nginx Logs:**
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Backup Strategy

**MongoDB Backup:**
```bash
# Create backup
mongodump --uri="mongodb://localhost:27017/solar-expert-prod" --out=/backup/$(date +%Y%m%d)

# Restore backup
mongorestore --uri="mongodb://localhost:27017/solar-expert-prod" /backup/20231215
```

**Automated Backup Script:**
```bash
#!/bin/bash
# /usr/local/bin/backup-db.sh
BACKUP_DIR="/backup/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb://localhost:27017/solar-expert-prod" --out="$BACKUP_DIR/$DATE"
# Keep only last 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +
```

Add to crontab:
```bash
crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-db.sh
```

---

## Troubleshooting

### Common Issues

**1. Build Errors:**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

**2. Port Already in Use:**
```bash
# Find process using port
lsof -i :5000
# Kill process
kill -9 <PID>
```

**3. MongoDB Connection Failed:**
- Check MongoDB is running: `sudo systemctl status mongod`
- Verify connection string in .env
- Check firewall rules

**4. Nginx 502 Bad Gateway:**
- Check backend is running: `pm2 status`
- Check backend logs: `pm2 logs`
- Verify proxy_pass URL in nginx config

**5. React App Shows Blank Page:**
- Check browser console for errors
- Verify build was successful
- Check nginx/Apache is serving correct directory
- Ensure all environment variables are set

### Performance Optimization

**1. Enable Gzip:**
Already configured in nginx.conf.example

**2. Enable Caching:**
Static assets cached for 1 year in example configs

**3. CDN Integration:**
Use CloudFlare or similar CDN for static assets

**4. Database Indexing:**
```javascript
// Add indexes to MongoDB collections
db.users.createIndex({ email: 1 }, { unique: true });
db.products.createIndex({ category: 1, published: 1 });
db.orders.createIndex({ userId: 1, createdAt: -1 });
```

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Generate strong JWT_SECRET
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure firewall (UFW/iptables)
- [ ] Set up fail2ban for brute force protection
- [ ] Regular security updates: `sudo apt update && sudo apt upgrade`
- [ ] Backup MongoDB regularly
- [ ] Monitor logs for suspicious activity
- [ ] Use environment variables (never commit secrets)
- [ ] Implement rate limiting
- [ ] Set proper CORS origins
- [ ] Disable directory listing
- [ ] Keep Node.js and npm updated

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backed up
- [ ] SSL certificates ready
- [ ] DNS configured
- [ ] Firewall rules set

### Deployment
- [ ] Build applications
- [ ] Copy files to server
- [ ] Configure web server
- [ ] Start backend with PM2
- [ ] Test all applications
- [ ] Verify API connectivity
- [ ] Check admin panel login
- [ ] Test user panel functionality

### Post-Deployment
- [ ] Monitor logs for errors
- [ ] Test all features
- [ ] Verify SSL working
- [ ] Check performance
- [ ] Set up monitoring/alerts
- [ ] Document any changes

---

## Support

For deployment assistance:
- Review logs: PM2, nginx, application logs
- Check documentation: README.md, ADMIN_PANEL_SETUP.md
- Verify all prerequisites are met
- Ensure environment variables are correctly set

---

**Deployment successfully completed! Your Solar Expert platform is now live! 🚀**
