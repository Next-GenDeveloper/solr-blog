import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminPages.css';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data } = await axios.get('/api/contact');
      setContacts(data.data);
    } catch (error) {
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (contactId, newStatus) => {
    try {
      await axios.put(`/api/contact/${contactId}`, { status: newStatus });
      toast.success('Contact status updated');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await axios.delete(`/api/contact/${id}`);
        toast.success('Contact deleted successfully');
        fetchContacts();
      } catch (error) {
        toast.error('Failed to delete contact');
      }
    }
  };

  const viewContactDetails = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
    if (contact.status === 'new') {
      handleStatusUpdate(contact._id, 'read');
    }
  };

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Contact Messages</h1>
          <p>Manage customer inquiries</p>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id}>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.phone || 'N/A'}</td>
                <td>{contact.subject}</td>
                <td>
                  <select
                    value={contact.status}
                    onChange={(e) => handleStatusUpdate(contact._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </td>
                <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" onClick={() => viewContactDetails(contact)}>
                      <FaEye />
                    </button>
                    <button className="btn-icon danger" onClick={() => handleDelete(contact._id)}>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedContact && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Contact Message Details</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-form">
              <div className="order-details">
                <h3>Contact Information</h3>
                <p><strong>Name:</strong> {selectedContact.name}</p>
                <p><strong>Email:</strong> {selectedContact.email}</p>
                <p><strong>Phone:</strong> {selectedContact.phone || 'N/A'}</p>
                <p><strong>Date:</strong> {new Date(selectedContact.createdAt).toLocaleString()}</p>

                <h3 style={{ marginTop: '1.5rem' }}>Subject</h3>
                <p>{selectedContact.subject}</p>

                <h3 style={{ marginTop: '1.5rem' }}>Message</h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>{selectedContact.message}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
