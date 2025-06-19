import React, { useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminDashboard = ({ products, fetchProducts }) => {
  const [form, setForm] = useState({
    name: '',
    buyPrice: '',
    sellPrice: '',
  });

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    let matchesFilter = true;
    if (filter === 'below50') matchesFilter = Number(p.buyPrice) < 50;
    else if (filter === '50to100') matchesFilter = Number(p.buyPrice) >= 50 && Number(p.buyPrice) <= 100;
    else if (filter === 'above100') matchesFilter = Number(p.buyPrice) > 100;
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`http://localhost:5000/api/products/update/${editId}`, form);
    } else {
      await axios.post('http://localhost:5000/api/products/add', form);
    }
    setForm({ name: '', buyPrice: '', sellPrice: '' });
    setEditId(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditId(product._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/delete/${id}`);
    fetchProducts();
  };

  return (
    <div className="dashboard-ui-root">
      <div className="dashboard-ui-container">
        <div className="dashboard-ui-form-card">
          <h2 className="dashboard-ui-title"><FaPlus style={{marginRight: 8}}/>Add / Edit Product</h2>
          <form onSubmit={handleSubmit} className="dashboard-ui-form">
            <label className="dashboard-ui-label">Product Name</label>
            <input
              type="text"
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="dashboard-ui-input"
            />
            <label className="dashboard-ui-label">Buy Price</label>
            <input
              type="number"
              placeholder="Buy Price"
              value={form.buyPrice}
              onChange={(e) => setForm({ ...form, buyPrice: e.target.value })}
              required
              className="dashboard-ui-input"
            />
            <label className="dashboard-ui-label">Sell Price</label>
            <input
              type="number"
              placeholder="Sell Price"
              value={form.sellPrice}
              onChange={(e) => setForm({ ...form, sellPrice: e.target.value })}
              required
              className="dashboard-ui-input"
            />
            <button type="submit" className="dashboard-ui-submit-btn">{editId ? 'Update' : 'Add'} Product</button>
          </form>
        </div>
        <div className="dashboard-ui-divider" />
        <div className="dashboard-ui-table-card">
          <h2 className="dashboard-ui-title">Product List</h2>
          <div className="dashboard-controls">
            <input
              className="dashboard-search-input"
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="dashboard-filter-select"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="below50">Below ₹50</option>
              <option value="50to100">₹50–₹100</option>
              <option value="above100">Above ₹100</option>
            </select>
          </div>
          <div className="dashboard-ui-table-wrapper">
            <table className="dashboard-ui-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Buy Price</th>
                  <th>Sell Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p, idx) => (
                  <tr key={p._id} className={idx % 2 === 0 ? 'dashboard-ui-row-even' : 'dashboard-ui-row-odd'}>
                    <td>{p.name}</td>
                    <td>₹{p.buyPrice}</td>
                    <td>₹{p.sellPrice}</td>
                    <td>
                      <button onClick={() => handleEdit(p)} className="dashboard-ui-edit-btn" title="Edit"><FaEdit /></button>
                      <button onClick={() => handleDelete(p._id)} className="dashboard-ui-delete-btn" title="Delete"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
