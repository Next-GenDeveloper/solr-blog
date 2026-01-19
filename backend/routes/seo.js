const express = require('express');
const router = express.Router();
const SEO = require('../models/SEO');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/seo
// @desc    Get all SEO settings
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const seoSettings = await SEO.find({});

    res.json({
      success: true,
      count: seoSettings.length,
      data: seoSettings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/seo/:page
// @desc    Get SEO settings for a specific page
// @access  Public
router.get('/:page', async (req, res) => {
  try {
    const seoSetting = await SEO.findOne({ page: req.params.page });

    if (!seoSetting) {
      return res.status(404).json({ message: 'SEO settings not found for this page' });
    }

    res.json({
      success: true,
      data: seoSetting,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/seo
// @desc    Create or update SEO settings for a page
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const {
      page,
      slug,
      metaTitle,
      metaDescription,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
      ogType,
      canonicalUrl,
      robotsIndex,
      robotsFollow,
      structuredData,
    } = req.body;

    // Check if SEO settings exist for this page
    let seoSetting = await SEO.findOne({ page });

    if (seoSetting) {
      // Update existing
      seoSetting.slug = slug || seoSetting.slug;
      seoSetting.metaTitle = metaTitle || seoSetting.metaTitle;
      seoSetting.metaDescription = metaDescription || seoSetting.metaDescription;
      seoSetting.keywords = keywords !== undefined ? keywords : seoSetting.keywords;
      seoSetting.ogTitle = ogTitle !== undefined ? ogTitle : seoSetting.ogTitle;
      seoSetting.ogDescription = ogDescription !== undefined ? ogDescription : seoSetting.ogDescription;
      seoSetting.ogImage = ogImage !== undefined ? ogImage : seoSetting.ogImage;
      seoSetting.ogType = ogType || seoSetting.ogType;
      seoSetting.canonicalUrl = canonicalUrl !== undefined ? canonicalUrl : seoSetting.canonicalUrl;
      seoSetting.robotsIndex = robotsIndex !== undefined ? robotsIndex : seoSetting.robotsIndex;
      seoSetting.robotsFollow = robotsFollow !== undefined ? robotsFollow : seoSetting.robotsFollow;
      seoSetting.structuredData = structuredData !== undefined ? structuredData : seoSetting.structuredData;

      await seoSetting.save();
    } else {
      // Create new
      seoSetting = await SEO.create({
        page,
        slug,
        metaTitle,
        metaDescription,
        keywords,
        ogTitle,
        ogDescription,
        ogImage,
        ogType,
        canonicalUrl,
        robotsIndex,
        robotsFollow,
        structuredData,
      });
    }

    res.status(201).json({
      success: true,
      data: seoSetting,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/seo/:page
// @desc    Update SEO settings for a page
// @access  Private/Admin
router.put('/:page', protect, admin, async (req, res) => {
  try {
    const seoSetting = await SEO.findOne({ page: req.params.page });

    if (!seoSetting) {
      return res.status(404).json({ message: 'SEO settings not found for this page' });
    }

    const {
      slug,
      metaTitle,
      metaDescription,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
      ogType,
      canonicalUrl,
      robotsIndex,
      robotsFollow,
      structuredData,
    } = req.body;

    seoSetting.slug = slug || seoSetting.slug;
    seoSetting.metaTitle = metaTitle || seoSetting.metaTitle;
    seoSetting.metaDescription = metaDescription || seoSetting.metaDescription;
    seoSetting.keywords = keywords !== undefined ? keywords : seoSetting.keywords;
    seoSetting.ogTitle = ogTitle !== undefined ? ogTitle : seoSetting.ogTitle;
    seoSetting.ogDescription = ogDescription !== undefined ? ogDescription : seoSetting.ogDescription;
    seoSetting.ogImage = ogImage !== undefined ? ogImage : seoSetting.ogImage;
    seoSetting.ogType = ogType || seoSetting.ogType;
    seoSetting.canonicalUrl = canonicalUrl !== undefined ? canonicalUrl : seoSetting.canonicalUrl;
    seoSetting.robotsIndex = robotsIndex !== undefined ? robotsIndex : seoSetting.robotsIndex;
    seoSetting.robotsFollow = robotsFollow !== undefined ? robotsFollow : seoSetting.robotsFollow;
    seoSetting.structuredData = structuredData !== undefined ? structuredData : seoSetting.structuredData;

    const updatedSEO = await seoSetting.save();

    res.json({
      success: true,
      data: updatedSEO,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/seo/:page
// @desc    Delete SEO settings for a page
// @access  Private/Admin
router.delete('/:page', protect, admin, async (req, res) => {
  try {
    const seoSetting = await SEO.findOne({ page: req.params.page });

    if (!seoSetting) {
      return res.status(404).json({ message: 'SEO settings not found for this page' });
    }

    await seoSetting.deleteOne();

    res.json({
      success: true,
      message: 'SEO settings deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
