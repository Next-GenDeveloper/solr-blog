const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
    unique: true,
    enum: ['home', 'about', 'contact', 'shop', 'blog', 'services'],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  metaTitle: {
    type: String,
    required: true,
    maxlength: 60,
  },
  metaDescription: {
    type: String,
    required: true,
    maxlength: 160,
  },
  keywords: {
    type: String,
    default: '',
  },
  ogTitle: {
    type: String,
    default: '',
  },
  ogDescription: {
    type: String,
    default: '',
  },
  ogImage: {
    type: String,
    default: '',
  },
  ogType: {
    type: String,
    default: 'website',
  },
  canonicalUrl: {
    type: String,
    default: '',
  },
  robotsIndex: {
    type: Boolean,
    default: true,
  },
  robotsFollow: {
    type: Boolean,
    default: true,
  },
  structuredData: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
seoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SEO', seoSchema);
