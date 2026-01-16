const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/blogs
// @desc    Get all published blogs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { published: true };
    
    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const blogs = await Blog.find(query)
      .sort({ publishedDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name');

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      count: blogs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/blogs/all
// @desc    Get all blogs (Admin only)
// @access  Private/Admin
router.get('/all', protect, admin, async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .populate('author', 'name email');

    res.json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/blogs/:id
// @desc    Get single blog
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/blogs
// @desc    Create a new blog
// @access  Private/Admin
router.post('/', protect, admin, upload.single('featuredImage'), async (req, res) => {
  try {
    const blogData = {
      title: req.body.title,
      content: req.body.content,
      excerpt: req.body.excerpt,
      author: req.user._id,
      authorName: req.user.name,
      category: req.body.category,
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      published: req.body.published === 'true',
    };

    if (req.file) {
      blogData.featuredImage = '/uploads/blogs/' + req.file.filename;
    }

    if (blogData.published) {
      blogData.publishedDate = Date.now();
    }

    const blog = await Blog.create(blogData);

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('featuredImage'), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.excerpt = req.body.excerpt || blog.excerpt;
    blog.category = req.body.category || blog.category;
    
    if (req.body.tags) {
      blog.tags = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags;
    }

    if (req.body.published !== undefined) {
      const wasPublished = blog.published;
      blog.published = req.body.published === 'true' || req.body.published === true;
      
      if (!wasPublished && blog.published) {
        blog.publishedDate = Date.now();
      }
    }

    if (req.file) {
      blog.featuredImage = '/uploads/blogs/' + req.file.filename;
    }

    const updatedBlog = await blog.save();

    res.json({
      success: true,
      data: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await blog.deleteOne();

    res.json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/blogs/:id/like
// @desc    Like/Unlike a blog post
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user already liked the blog
    const alreadyLiked = blog.likes.includes(req.user._id);

    if (alreadyLiked) {
      // Unlike: remove user from likes array
      blog.likes = blog.likes.filter(userId => userId.toString() !== req.user._id.toString());
      blog.likesCount = Math.max(0, blog.likesCount - 1);
    } else {
      // Like: add user to likes array
      blog.likes.push(req.user._id);
      blog.likesCount += 1;
    }

    await blog.save();

    res.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: blog.likesCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/blogs/:id/share
// @desc    Increment share count
// @access  Public
router.post('/:id/share', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.shares += 1;
    await blog.save();

    res.json({
      success: true,
      shares: blog.shares,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/blogs/:id/comments
// @desc    Get all comments for a blog
// @access  Public
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.id })
      .sort({ createdAt: -1 })
      .populate('user', 'name');

    res.json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/blogs/:id/comments
// @desc    Add a comment to a blog
// @access  Private
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const comment = await Comment.create({
      blog: req.params.id,
      user: req.user._id,
      userName: req.user.name,
      text: req.body.text,
    });

    // Increment comments count
    blog.commentsCount += 1;
    await blog.save();

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/blogs/:blogId/comments/:commentId
// @desc    Delete a comment
// @access  Private (Owner or Admin)
router.delete('/:blogId/comments/:commentId', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is comment owner or admin
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();

    // Decrement comments count
    const blog = await Blog.findById(req.params.blogId);
    if (blog) {
      blog.commentsCount = Math.max(0, blog.commentsCount - 1);
      await blog.save();
    }

    res.json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
