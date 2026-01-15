# Deployment Guide for Solar Expert

This guide covers deploying your Solar Expert website to production.

## 🌐 Deployment Options

### Option 1: Deploy to Heroku (Recommended for Beginners)

#### Prerequisites:
- Heroku account (free tier available)
- Heroku CLI installed
- Git repository

#### Steps:

**1. Prepare Your Application:**

Create `backend/Procfile`:
```
web: node server.js
```

Update `backend/package.json` to include:
```json
"engines": {
  "node": "18.x",
  "npm": "9.x"
}
```

**2. Setup MongoDB Atlas (Free):**

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create database user
4. Whitelist all IPs (0.0.0.0/0) for development
5. Get connection string

**3. Deploy Backend:**

```bash
cd backend

# Login to Heroku
heroku login

# Create Heroku app
heroku create solar-expert-backend

# Set environment variables
heroku config:set MONGODB_URI="your-mongodb-atlas-connection-string"
heroku config:set JWT_SECRET="your-super-secret-key"
heroku config:set JWT_EXPIRE="30d"
heroku config:set NODE_ENV="production"

# Deploy
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a solar-expert-backend
git push heroku master
```

**4. Deploy Frontend to Netlify:**

1. Build the app:
```bash
cd frontend
npm run build
```

2. Update API URLs in frontend code to use your Heroku backend URL

3. Deploy to Netlify:
- Go to https://www.netlify.com/
- Drag and drop the `build` folder
- Configure domain

### Option 2: Deploy to DigitalOcean

#### Prerequisites:
- DigitalOcean account
- SSH key configured
- Domain name (optional)

#### Steps:

**1. Create Droplet:**
- Ubuntu 22.04 LTS
- Basic plan ($6/month)
- Add SSH keys

**2. SSH into Droplet:**
```bash
ssh root@your-droplet-ip
```

**3. Setup Server:**
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod

# Install PM2
npm install -g pm2

# Install Nginx
apt install -y nginx
```

**4. Deploy Application:**
```bash
# Clone repository
cd /var/www
git clone your-repository-url solar-expert
cd solar-expert

# Setup Backend
cd backend
npm install
cp .env.example .env
# Edit .env with production values
nano .env

# Setup Frontend
cd ../frontend
npm install
npm run build

# Start backend with PM2
cd ../backend
pm2 start server.js --name solar-expert-backend
pm2 save
pm2 startup
```

**5. Configure Nginx:**

Create `/etc/nginx/sites-available/solar-expert`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/solar-expert/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/solar-expert /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

**6. Setup SSL (Optional but Recommended):**
```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

### Option 3: Deploy to Vercel (Frontend) + Railway (Backend)

#### Frontend to Vercel:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd frontend
vercel
```

3. Follow prompts and configure environment variables in Vercel dashboard

#### Backend to Railway:

1. Go to https://railway.app/
2. Create new project
3. Deploy from GitHub
4. Add environment variables
5. Add MongoDB plugin
6. Deploy

## 🔒 Production Checklist

### Security:
- [ ] Change JWT_SECRET to a strong, random string
- [ ] Use HTTPS (SSL certificate)
- [ ] Set secure environment variables
- [ ] Enable CORS only for your domain
- [ ] Set strong admin password
- [ ] Configure MongoDB authentication
- [ ] Setup firewall rules
- [ ] Regular security updates

### Performance:
- [ ] Enable gzip compression
- [ ] Setup CDN for static assets
- [ ] Optimize images
- [ ] Enable caching
- [ ] Minify CSS/JS
- [ ] Use production build

### Monitoring:
- [ ] Setup error logging (Sentry)
- [ ] Configure uptime monitoring
- [ ] Setup analytics (Google Analytics)
- [ ] Monitor database performance
- [ ] Setup backup system

### Environment Variables (Production):

```bash
# Backend .env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/solarexpert
JWT_SECRET=your_very_long_random_secret_key_min_32_characters
JWT_EXPIRE=30d
NODE_ENV=production

# Add these for email (future feature)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 📊 Post-Deployment

### 1. Test Everything:
- User registration and login
- Admin panel access
- Product CRUD operations
- Blog CRUD operations
- Contact form submission
- File uploads
- Payment processing (if implemented)

### 2. Create Admin User:
```bash
# SSH into server
cd /var/www/solar-expert/backend
node admin-setup.js
```

### 3. Add Content:
- Upload product images
- Create initial blog posts
- Configure site settings

### 4. Setup Backups:

**MongoDB Backup Script:**
```bash
#!/bin/bash
# backup-mongodb.sh

BACKUP_DIR="/var/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
mongodump --out=$BACKUP_DIR/backup_$DATE
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $BACKUP_DIR/backup_$DATE
rm -rf $BACKUP_DIR/backup_$DATE

# Keep only last 7 backups
ls -t $BACKUP_DIR/*.tar.gz | tail -n +8 | xargs rm -f
```

Add to crontab:
```bash
# Run daily at 2 AM
0 2 * * * /path/to/backup-mongodb.sh
```

## 🔄 Continuous Deployment

### GitHub Actions (Example):

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd frontend && npm ci
        cd ../backend && npm ci
    
    - name: Build frontend
      run: cd frontend && npm run build
    
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/solar-expert
          git pull
          cd backend && npm install
          cd ../frontend && npm install && npm run build
          pm2 restart solar-expert-backend
```

## 📈 Monitoring & Maintenance

### Setup PM2 Monitoring:
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Monitor Logs:
```bash
# View all logs
pm2 logs

# View specific app logs
pm2 logs solar-expert-backend

# Monitor with dashboard
pm2 monit
```

### Update Application:
```bash
cd /var/www/solar-expert
git pull
cd backend && npm install
cd ../frontend && npm install && npm run build
pm2 restart solar-expert-backend
```

## 🆘 Troubleshooting Production Issues

### Issue: Application won't start
```bash
# Check logs
pm2 logs solar-expert-backend

# Check if port is in use
netstat -tuln | grep 5000

# Restart application
pm2 restart solar-expert-backend
```

### Issue: Database connection failed
```bash
# Check MongoDB status
systemctl status mongod

# Check connection string in .env
cat /var/www/solar-expert/backend/.env

# Test MongoDB connection
mongo --eval "db.adminCommand('ping')"
```

### Issue: High memory usage
```bash
# Check system resources
htop

# Restart PM2
pm2 restart all

# Clear logs
pm2 flush
```

## 📞 Support

For deployment assistance, consult:
- Heroku Docs: https://devcenter.heroku.com/
- DigitalOcean Tutorials: https://www.digitalocean.com/community/tutorials
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/

---

**Good luck with your deployment! 🚀**
