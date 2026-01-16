import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminPages.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/users');
      setUsers(data.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${id}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const viewUserDetails = async (userId) => {
    try {
      const { data } = await axios.get(`/api/users/${userId}`);
      setSelectedUser(data.data);
      setShowModal(true);
    } catch (error) {
      toast.error('Failed to fetch user details');
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await axios.put(`/api/users/${userId}`, { isActive: !currentStatus });
      toast.success('User status updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Users Management</h1>
          <p>Manage registered users</p>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone || 'N/A'}</td>
                <td><span className="badge">{user.role}</span></td>
                <td>
                  <span className={`status-badge ${user.isActive ? 'published' : 'draft'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" onClick={() => viewUserDetails(user._id)}>
                      <FaEye />
                    </button>
                    <button 
                      className="btn-icon" 
                      onClick={() => handleStatusToggle(user._id, user.isActive)}
                      title={user.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <FaEdit />
                    </button>
                    <button className="btn-icon danger" onClick={() => handleDelete(user._id)}>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>User Details</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-form">
              <div className="order-details">
                <h3>Personal Information</h3>
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
                <p><strong>Status:</strong> {selectedUser.isActive ? 'Active' : 'Inactive'}</p>

                <h3 style={{ marginTop: '1.5rem' }}>Account Activity</h3>
                <p><strong>Registered:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
                <p><strong>Last Login:</strong> {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}</p>

                {selectedUser.loginHistory && selectedUser.loginHistory.length > 0 && (
                  <>
                    <h3 style={{ marginTop: '1.5rem' }}>Recent Login History</h3>
                    {selectedUser.loginHistory.slice(-5).reverse().map((login, index) => (
                      <p key={index} style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                        {new Date(login.timestamp).toLocaleString()} - {login.ipAddress || 'Unknown IP'}
                      </p>
                    ))}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Users;
