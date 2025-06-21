import React, { useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const AdminDashboard = ({ products, fetchProducts, shopName }) => {
  console.log('AdminDashboard - products:', products); // Debug log
  console.log('AdminDashboard - shopName:', shopName); // Debug log
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

  console.log('AdminDashboard - filteredProducts:', filteredProducts); // Debug log

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`http://localhost:5000/api/products/update/${editId}`, { ...form, shop: shopName });
    } else {
      await axios.post('http://localhost:5000/api/products/add', { ...form, shop: shopName });
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
    await axios.delete(`http://localhost:5000/api/products/delete/${id}?shop=${shopName}`);
    fetchProducts();
  };

  // Export filtered products to Excel (now includes _id)
  const handleExportExcel = () => {
    const data = filteredProducts.map(({ _id, name, buyPrice, sellPrice }) => ({
      ID: _id,
      Name: name,
      'Buy Price': buyPrice,
      'Sell Price': sellPrice,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    XLSX.writeFile(workbook, 'products.xlsx');
  };

  // Handle Excel file upload and update products
  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet);
      for (const row of rows) {
        if (row.ID && (row['Buy Price'] !== undefined || row['Sell Price'] !== undefined)) {
          try {
            console.log('Updating:', row.ID, row['Buy Price'], row['Sell Price']);
            await axios.put(`http://localhost:5000/api/products/update/${row.ID}`, {
              buyPrice: row['Buy Price'],
              sellPrice: row['Sell Price'],
            });
          } catch (err) {
            console.error('Update failed for', row.ID, err);
          }
        }
      }
      fetchProducts();
      alert('Products updated successfully!');
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="dashboard-ui-root">
      <div className="dashboard-ui-container">
        <div className="dashboard-ui-form-card">
          <h2 className="dashboard-ui-title"><FaPlus style={{marginRight: 8}}/>Add / Edit Product - {shopName}</h2>
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
          <h2 className="dashboard-ui-title">Product List of {shopName}</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <button onClick={handleExportExcel} className="dashboard-ui-export-btn" style={{ padding: '6px 14px', fontWeight: 600, borderRadius: 4, background: '#4caf50', color: '#fff', border: 'none', cursor: 'pointer', marginRight: 10 }}>
                Export to Excel
              </button>
            </div>
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
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                      {products.length === 0 ? 'No products found for this shop. Add some products to get started!' : 'No products match your search/filter criteria.'}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p, idx) => (
                    <tr key={p._id} className={idx % 2 === 0 ? 'dashboard-ui-row-even' : 'dashboard-ui-row-odd'}>
                      <td>{p.name}</td>
                      <td>₹{p.buyPrice}</td>
                      <td>₹{p.sellPrice}</td>
                      <td>
                        <button onClick={() => handleEdit(p)} className="dashboard-ui-edit-btn" title="Edit"><FaEdit /></button>
                        <button onClick={() => handleDelete(p._id)} className="dashboard-ui-delete-btn" title="Delete"><FaTrash /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
