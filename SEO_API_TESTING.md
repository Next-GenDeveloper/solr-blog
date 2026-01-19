# SEO API Testing Examples

## Test SEO Settings API

### 1. Create SEO Settings for Home Page

```bash
POST http://localhost:5000/api/seo
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN

{
  "page": "home",
  "slug": "",
  "metaTitle": "Solar Expert - Premium Solar Solutions",
  "metaDescription": "Welcome to Solar Expert. Discover premium solar solutions, sustainable energy products, and expert insights on renewable energy.",
  "keywords": "solar panels, solar energy, renewable energy, solar solutions, sustainable energy, green energy",
  "ogTitle": "Solar Expert - Your Solar Energy Partner",
  "ogDescription": "Transform your energy consumption with our premium solar solutions",
  "ogImage": "/logo192.png",
  "ogType": "website",
  "canonicalUrl": "",
  "robotsIndex": true,
  "robotsFollow": true
}
```

### 2. Create SEO for About Page

```bash
POST http://localhost:5000/api/seo
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN

{
  "page": "about",
  "slug": "about",
  "metaTitle": "About Us - Solar Energy Experts",
  "metaDescription": "Learn about our mission to provide sustainable solar energy solutions. Discover our values, team, and commitment to a greener future.",
  "keywords": "about us, solar energy, renewable energy, sustainability, green energy, solar experts",
  "ogTitle": "About Solar Expert",
  "ogDescription": "Leading the way in sustainable solar energy solutions",
  "ogImage": "",
  "ogType": "website",
  "canonicalUrl": "",
  "robotsIndex": true,
  "robotsFollow": true
}
```

### 3. Get All SEO Settings

```bash
GET http://localhost:5000/api/seo
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### 4. Get SEO for Specific Page

```bash
GET http://localhost:5000/api/seo/home
```

### 5. Update SEO Settings

```bash
PUT http://localhost:5000/api/seo/home
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN

{
  "metaTitle": "Updated Title",
  "metaDescription": "Updated description"
}
```

---

## Test Blog API with Slugs

### 1. Create Blog with Auto-Generated Slug

```bash
POST http://localhost:5000/api/blogs
Content-Type: multipart/form-data
Authorization: Bearer YOUR_ADMIN_TOKEN

title=How to Choose Solar Panels
content=Complete guide to selecting the right solar panels...
excerpt=Learn how to select the best solar panels
category=Technology
tags=solar,panels,guide
published=true
# slug will be auto-generated as "how-to-choose-solar-panels"
```

### 2. Create Blog with Custom Slug

```bash
POST http://localhost:5000/api/blogs
Content-Type: multipart/form-data
Authorization: Bearer YOUR_ADMIN_TOKEN

title=Solar Panel Installation Guide
content=Step by step installation...
excerpt=Professional installation guide
category=Installation
tags=installation,guide
published=true
slug=solar-installation-guide-2024
metaTitle=Solar Panel Installation Guide 2024
metaDescription=Complete professional guide to installing solar panels
keywords=solar installation, panel setup, DIY solar
```

### 3. Get Blog by Slug

```bash
GET http://localhost:5000/api/blogs/how-to-choose-solar-panels
```

### 4. Get Blog by ID (backward compatibility)

```bash
GET http://localhost:5000/api/blogs/507f1f77bcf86cd799439011
```

---

## Test Product API with Slugs

### 1. Create Product with Auto-Generated Slug

```bash
POST http://localhost:5000/api/products
Content-Type: multipart/form-data
Authorization: Bearer YOUR_ADMIN_TOKEN

name=500W Monocrystalline Solar Panel
description=High-efficiency solar panel for residential use
price=299.99
comparePrice=399.99
category=Solar Panels
stock=50
sku=SP-500W-MONO
isActive=true
# slug will be auto-generated as "500w-monocrystalline-solar-panel"
```

### 2. Create Product with Custom Slug and SEO

```bash
POST http://localhost:5000/api/products
Content-Type: multipart/form-data
Authorization: Bearer YOUR_ADMIN_TOKEN

name=Premium 1000W Solar Inverter
description=Advanced inverter with smart monitoring
price=599.99
category=Inverters
stock=25
sku=INV-1000W-SMART
slug=premium-solar-inverter-1000w
metaTitle=1000W Premium Solar Inverter - Smart Monitoring
metaDescription=High-efficiency 1000W solar inverter with advanced monitoring features. Perfect for residential solar systems.
keywords=solar inverter, 1000W inverter, smart inverter, renewable energy
isActive=true
```

### 3. Get Product by Slug

```bash
GET http://localhost:5000/api/products/500w-monocrystalline-solar-panel
```

---

## Test Sitemap and Robots

### Get Sitemap

```bash
GET http://localhost:5000/sitemap.xml
```

Expected Response:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://localhost:3000/</loc>
    <lastmod>2024-01-20T12:00:00.000Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>http://localhost:3000/blog/how-to-choose-solar-panels</loc>
    <lastmod>2024-01-20T12:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <!-- More URLs -->
</urlset>
```

### Get Robots.txt

```bash
GET http://localhost:5000/robots.txt
```

Expected Response:
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /cart
Disallow: /checkout
Disallow: /login
Disallow: /register

Sitemap: http://localhost:3000/sitemap.xml
```

---

## Testing with cURL

### Create SEO Settings

```bash
curl -X POST http://localhost:5000/api/seo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "page": "home",
    "slug": "",
    "metaTitle": "Solar Expert",
    "metaDescription": "Premium solar solutions"
  }'
```

### Get Sitemap

```bash
curl http://localhost:5000/sitemap.xml
```

### Get Robots

```bash
curl http://localhost:5000/robots.txt
```

---

## Validation Tools

### Google Tools
1. **Rich Results Test**: https://search.google.com/test/rich-results
   - Test structured data implementation

2. **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
   - Verify mobile SEO

3. **PageSpeed Insights**: https://pagespeed.web.dev/
   - Check page performance

### Social Media
1. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
   - Test Open Graph tags

2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
   - Test Twitter cards

### SEO Tools
1. **Screaming Frog**: Free desktop tool for crawling
2. **Ahrefs Webmaster Tools**: Free SEO audit
3. **SEMrush**: Comprehensive SEO analysis

---

## Expected Behavior

### Slug Generation
- **Input**: "How to Choose Solar Panels 2024!"
- **Output**: "how-to-choose-solar-panels-2024"

### Duplicate Slugs
- **First**: "solar-panel-guide"
- **Second**: "solar-panel-guide-1"
- **Third**: "solar-panel-guide-2"

### Meta Title Truncation
- **Input**: "This is a very long title that exceeds the sixty character limit and needs to be truncated"
- **Output**: "This is a very long title that exceeds the sixty ch... | Solr Blog"

### Meta Description
- **Max Length**: 160 characters
- **Auto-extracted**: From blog content or product description if not provided

---

## Response Examples

### Successful Blog Creation

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "How to Choose Solar Panels",
    "slug": "how-to-choose-solar-panels",
    "metaTitle": "How to Choose Solar Panels | Solr Blog",
    "metaDescription": "Complete guide to selecting the right solar panels for your home...",
    "keywords": "solar, panels, guide, renewable energy",
    "ogImage": "/uploads/blogs/solar-panels.jpg",
    "canonicalUrl": "",
    "published": true,
    "createdAt": "2024-01-20T12:00:00.000Z"
  }
}
```

### SEO Settings Response

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "page": "home",
    "slug": "",
    "metaTitle": "Solar Expert - Premium Solar Solutions",
    "metaDescription": "Welcome to Solar Expert...",
    "keywords": "solar panels, solar energy",
    "ogTitle": "Solar Expert - Your Solar Energy Partner",
    "ogImage": "/logo192.png",
    "robotsIndex": true,
    "robotsFollow": true
  }
}
```

---

## Common Errors and Solutions

### Error: Duplicate Slug
```json
{
  "message": "Duplicate key error",
  "error": "E11000 duplicate key error collection"
}
```
**Solution**: System will auto-increment. If manual slug, choose different one.

### Error: Validation Failed
```json
{
  "message": "Validation failed",
  "errors": {
    "metaTitle": "Meta title is required"
  }
}
```
**Solution**: Provide required fields.

### Error: Page Not Found
```json
{
  "message": "Blog not found"
}
```
**Solution**: Check slug spelling or use ID instead.

---

Happy Testing! 🚀
