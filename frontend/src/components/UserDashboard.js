import React, { useState } from 'react';

const UserDashboard = ({ products }) => {
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

  return (
    <div className="dashboard">
      <h2>User Dashboard</h2>
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
      <ul>
        {filteredProducts.map((p) => (
          <li key={p._id}>
            {p.name} – Buy: ₹{p.buyPrice}, Sell: ₹{p.sellPrice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;
