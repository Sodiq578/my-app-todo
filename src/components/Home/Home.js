// Home.js

// Importing necessary libraries and styles
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Home.css";

// Home function
const Home = () => {
  // State variables
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    summa: 0,
    userProvidedTime: new Date(),
    returnedTime: new Date(),
  });
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load data from local storage on component mount
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("yourDataKey")) || [];
    setData(storedData);
  }, []);

  // Save data to local storage when data changes
  useEffect(() => {
    localStorage.setItem("yourDataKey", JSON.stringify(data));
  }, [data]);

  // Add or edit item
  const handleAdd = () => {
    if (editingItemId !== null) {
      const updatedData = data.map((item) =>
        item.id === editingItemId ? { ...item, ...newItem } : item
      );
      setData(updatedData);
      setEditingItemId(null);
    } else {
      const newId =
        data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1;
      setData([...data, { id: newId, ...newItem }]);
    }

    setShowModal(false);
    setShowDeleteConfirmation(false);

    setNewItem({
      name: "",
      summa: 0,
      userProvidedTime: new Date(),
      returnedTime: new Date(),
    });
  };

  // Edit item
  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item.id === id);

    setEditingItemId(id);
    setNewItem({
      name: itemToEdit.name,
      summa: itemToEdit.summa,
      userProvidedTime: new Date(itemToEdit.userProvidedTime),
      returnedTime: new Date(itemToEdit.returnedTime),
    });

    setShowModal(true);
  };

  // Delete item
  const handleDelete = (id) => {
    setItemToDeleteId(id);
    setShowDeleteConfirmation(true);
  };

  // Confirm item deletion
  const confirmDelete = () => {
    const updatedData = data.filter((item) => item.id !== itemToDeleteId);
    setData(updatedData);

    setShowDeleteConfirmation(false);
  };

  // Cancel item deletion
  const cancelDelete = () => {
    setItemToDeleteId(null);
    setShowDeleteConfirmation(false);
  };

  // Handle search input changes
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="container">
      <h1>Home</h1>
      <button onClick={() => setShowModal(true)}>Add</button>
      <table className="rwd-table">
        <tbody>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Summa</th>
            <th>User Provided Time</th>
            <th>Returned Time</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
          {data.map((item) => (
            <tr key={item.id}>
              <td data-th="ID">{item.id}</td>
              <td data-th="Name">{item.name}</td>
              <td data-th="Summa">{item.summa}</td>
              <td data-th="User Provided Time">{item.userProvidedTime.toString()}</td>
              <td data-th="Returned Time">{item.returnedTime.toString()}</td>
              <td data-th="Edit">
                <button onClick={() => handleEdit(item.id)}>Edit</button>
              </td>
              <td data-th="Delete">
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <label>Name:</label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <label>Summa:</label>
            <input
              type="number"
              value={newItem.summa}
              onChange={(e) => setNewItem({ ...newItem, summa: e.target.value })}
            />
            <label>User Provided Time:</label>
            <DatePicker
              selected={newItem.userProvidedTime}
              onChange={(date) => setNewItem({ ...newItem, userProvidedTime: date })}
            />
            <label>Returned Time:</label>
            <DatePicker
              selected={newItem.returnedTime}
              onChange={(date) => setNewItem({ ...newItem, returnedTime: date })}
            />
            <button onClick={handleAdd}>Save</button>
          </div>
        </div>
      )}
      {/* ... (rest of your component) */}
    </div>
  );
};

export default Home;
