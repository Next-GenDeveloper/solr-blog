const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/comments
// @desc    Get all comments (Admin only)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const comments = await Comment.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('blog', 'title');

    res.json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/comments/:id/approve
// @desc    Approve a comment
// @access  Private/Admin
router.put('/:id/approve', protect, admin, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.status = 'approved';
    await comment.save();

    res.json({
      success: true,
      message: 'Comment approved successfully',
      data: comment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/comments/:id/reject
// @desc    Reject a comment
// @access  Private/Admin
router.put('/:id/reject', protect, admin, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.status = 'rejected';
    await comment.save();

    res.json({
      success: true,
      message: 'Comment rejected successfully',
      data: comment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await comment.deleteOne();

    // Decrement comments count in blog
    const blog = await Blog.findById(comment.blog);
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
