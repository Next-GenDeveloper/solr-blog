const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Blog = require('../models/Blog');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    // Get counts
    const [usersCount, productsCount, blogsCount, ordersCount] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Blog.countDocuments(),
      Order.countDocuments(),
    ]);

    // Get revenue statistics
    const revenueData = await Order.aggregate([
      {
        $match: {
          orderStatus: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$total' }
        }
      }
    ]);

    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get monthly revenue for chart (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
          orderStatus: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get new users this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Get recent orders
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .select('orderNumber customerInfo total orderStatus createdAt');

    // Get recent users
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    // Get low stock products
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .select('name stock')
      .limit(5);

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    // Populate top products with product details
    const populatedTopProducts = await Product.populate(topProducts, {
      path: '_id',
      select: 'name images'
    });

    // Format monthly data for chart
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = monthlyRevenue.map(item => ({
      name: monthNames[item._id.month - 1],
      month: item._id.month,
      year: item._id.year,
      revenue: item.revenue,
      orders: item.orders
    }));

    // Calculate trends (comparing to last month)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const lastMonthOrders = await Order.countDocuments({
      createdAt: { $gte: lastMonth }
    });

    const previousMonthOrders = await Order.countDocuments({
      createdAt: { $gte: twoMonthsAgo, $lt: lastMonth }
    });

    const ordersTrend = previousMonthOrders > 0 
      ? (((lastMonthOrders - previousMonthOrders) / previousMonthOrders) * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        counts: {
          users: usersCount,
          products: productsCount,
          blogs: blogsCount,
          orders: ordersCount,
          newUsersThisMonth
        },
        revenue: revenueData[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
        ordersByStatus: ordersByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        chartData,
        recentOrders,
        recentUsers,
        lowStockProducts,
        topProducts: populatedTopProducts.map(p => ({
          product: p._id,
          totalSold: p.totalSold,
          revenue: p.revenue
        })),
        trends: {
          orders: parseFloat(ordersTrend)
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/dashboard/recent-activity
// @desc    Get recent activity for dashboard
// @access  Private/Admin
router.get('/recent-activity', protect, admin, async (req, res) => {
  try {
    const [recentOrders, recentUsers, recentBlogs] = await Promise.all([
      Order.find({})
        .sort({ createdAt: -1 })
        .limit(3)
        .select('orderNumber customerInfo total createdAt'),
      User.find({})
        .sort({ createdAt: -1 })
        .limit(3)
        .select('name email createdAt'),
      Blog.find({})
        .sort({ createdAt: -1 })
        .limit(3)
        .select('title createdAt')
    ]);

    // Combine and sort by date
    const activities = [
      ...recentOrders.map(order => ({
        type: 'order',
        text: `New order ${order.orderNumber} from ${order.customerInfo?.name || 'Customer'}`,
        amount: order.total,
        time: order.createdAt
      })),
      ...recentUsers.map(user => ({
        type: 'user',
        text: `New user registered: ${user.name}`,
        time: user.createdAt
      })),
      ...recentBlogs.map(blog => ({
        type: 'blog',
        text: `New blog post: ${blog.title}`,
        time: blog.createdAt
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
