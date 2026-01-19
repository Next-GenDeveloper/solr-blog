const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { createUniqueSlug, generateMetaTitle, generateMetaDescription, extractKeywords } = require('../utils/slugify');

// @route   GET /api/products
// @desc    Get all active products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = { isActive: true };
    
    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/products/all
// @desc    Get all products (Admin only)
// @access  Private/Admin
router.get('/all', protect, admin, async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    let product;
    
    // Check if param is a valid MongoDB ObjectId or slug
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(req.params.id);
    } else {
      // Try to find by slug
      product = await Product.findOne({ slug: req.params.id });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private/Admin
router.post('/', protect, admin, upload.array('images', 5), async (req, res) => {
  try {
    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      comparePrice: req.body.comparePrice,
      category: req.body.category,
      subcategory: req.body.subcategory,
      stock: req.body.stock,
      sku: req.body.sku,
      features: req.body.features ? JSON.parse(req.body.features) : [],
      specifications: req.body.specifications ? JSON.parse(req.body.specifications) : [],
      isFeatured: req.body.isFeatured === 'true',
      isActive: req.body.isActive !== 'false',
    };

    // Generate slug if not provided
    if (req.body.slug) {
      productData.slug = await createUniqueSlug(Product, req.body.slug);
    } else {
      productData.slug = await createUniqueSlug(Product, req.body.name);
    }

    // Generate SEO data if not provided
    productData.metaTitle = req.body.metaTitle || generateMetaTitle(req.body.name);
    productData.metaDescription = req.body.metaDescription || generateMetaDescription(req.body.description);
    productData.keywords = req.body.keywords || extractKeywords(req.body.name + ' ' + req.body.description + ' ' + req.body.category);
    productData.ogImage = req.body.ogImage || '';
    productData.canonicalUrl = req.body.canonicalUrl || '';

    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => '/uploads/products/' + file.filename);
      if (!productData.ogImage) {
        productData.ogImage = productData.images[0];
      }
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/:id', protect, admin, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const nameChanged = req.body.name && req.body.name !== product.name;

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.comparePrice = req.body.comparePrice || product.comparePrice;
    product.category = req.body.category || product.category;
    product.subcategory = req.body.subcategory || product.subcategory;
    product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
    product.sku = req.body.sku || product.sku;
    
    if (req.body.features) {
      product.features = typeof req.body.features === 'string' ? JSON.parse(req.body.features) : req.body.features;
    }

    if (req.body.specifications) {
      product.specifications = typeof req.body.specifications === 'string' ? JSON.parse(req.body.specifications) : req.body.specifications;
    }

    // Update slug if provided or if name changed
    if (req.body.slug) {
      product.slug = await createUniqueSlug(Product, req.body.slug, product._id);
    } else if (nameChanged) {
      product.slug = await createUniqueSlug(Product, product.name, product._id);
    }

    // Update SEO fields
    if (req.body.metaTitle !== undefined) product.metaTitle = req.body.metaTitle;
    if (req.body.metaDescription !== undefined) product.metaDescription = req.body.metaDescription;
    if (req.body.keywords !== undefined) product.keywords = req.body.keywords;
    if (req.body.ogImage !== undefined) product.ogImage = req.body.ogImage;
    if (req.body.canonicalUrl !== undefined) product.canonicalUrl = req.body.canonicalUrl;

    if (req.body.isFeatured !== undefined) {
      product.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;
    }

    if (req.body.isActive !== undefined) {
      product.isActive = req.body.isActive === 'true' || req.body.isActive === true;
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => '/uploads/products/' + file.filename);
      product.images = [...product.images, ...newImages];
    }

    const updatedProduct = await product.save();

    res.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
