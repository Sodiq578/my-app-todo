// Home.js

import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', summa: 0, userProvidedTime: '', returnedTime: '' });
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('yourDataKey')) || [];
    setData(storedData);
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('yourDataKey', JSON.stringify(data));
  }, [data]);

  const handleAdd = () => {
    if (editingItemId !== null) {
      // Editing an existing item
      const updatedData = data.map(item =>
        item.id === editingItemId ? { ...item, ...newItem } : item
      );
      setData(updatedData);
      setEditingItemId(null);
    } else {
      // Adding a new item
      const newId = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
      setData([...data, { id: newId, ...newItem }]);
    }

    // Close the modals
    setShowModal(false);
    setShowDeleteConfirmation(false);

    // Clear the newItem state
    setNewItem({ name: '', summa: 0, userProvidedTime: '', returnedTime: '' });
  };

  const handleEdit = (id) => {
    // Find the item to edit
    const itemToEdit = data.find(item => item.id === id);

    // Set the editing item and populate the modal fields
    setEditingItemId(id);
    setNewItem({
      name: itemToEdit.name,
      summa: itemToEdit.summa,
      userProvidedTime: itemToEdit.userProvidedTime,
      returnedTime: itemToEdit.returnedTime,
    });

    // Open the modal
    setShowModal(true);
  };

  const handleDelete = (id) => {
    // Set the item id to delete
    setItemToDeleteId(id);
    // Show the delete confirmation modal
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    // Filter out the item with the specified id
    const updatedData = data.filter(item => item.id !== itemToDeleteId);
    // Update the data state
    setData(updatedData);

    // Close the delete confirmation modal
    setShowDeleteConfirmation(false);
  };

  const cancelDelete = () => {
    // Reset the item id to delete
    setItemToDeleteId(null);
    // Close the delete confirmation modal
    setShowDeleteConfirmation(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div>
      <h1>Home</h1>
      <div>
        <input
          type="text"
          placeholder='Qidirish: '
          className="search-input"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ism</th>
            <th>Summa</th>
            <th>Mijozga berilgan vaqt</th>
            <th>Qaytariladigan vaqt</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data
            .filter((item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.summa.toString().includes(searchQuery) ||
              item.userProvidedTime.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.returnedTime.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.summa}</td>
                <td>{item.userProvidedTime}</td>
                <td>{item.returnedTime}</td>
                <td>
                  <button onClick={() => handleEdit(item.id)}>Edit</button>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <button onClick={() => setShowModal(true)}>Add</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <label>Name: </label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <br />
            <label>Summa: </label>
            <input
              type="number"
              value={newItem.summa}
              onChange={(e) => setNewItem({ ...newItem, summa: parseInt(e.target.value, 10) })}
            />
            <br />
            <label>Mijozga berilgan vaqt: </label>
            <input
              type="text"
              placeholder="Mijozga berilgan vaqt"
              value={newItem.userProvidedTime}
              onChange={(e) => setNewItem({ ...newItem, userProvidedTime: e.target.value })}
            />
            <br />
            <label>Qaytariladigan vaqt: </label>
            <input
              type="text"
              placeholder="Qaytariladigan vaqt"
              value={newItem.returnedTime}
              onChange={(e) => setNewItem({ ...newItem, returnedTime: e.target.value })}
            />
            <br />
            <button onClick={handleAdd}>
              {editingItemId !== null ? 'Edit' : 'Add'}
            </button>
            <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this item?</p>
          <div>
            <button onClick={confirmDelete}>Yes</button>
            <button onClick={cancelDelete}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
