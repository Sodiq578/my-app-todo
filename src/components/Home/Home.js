// Home.js

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom"; // Link komponentini import qo'shing
import "./Home.css";

const Home = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [newItem, setNewItem] = useState({
    id: 0,
    name: "",
    summa: 0,
    userProvidedTime: new Date(),
    returnedTime: new Date(),
    phoneNumbers: [{ id: 1, number: "" }],
  });
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("yourDataKey")) || [];
    setData(storedData);
  }, []);

  useEffect(() => {
    localStorage.setItem("yourDataKey", JSON.stringify(data));
  }, [data]);

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
      id: 0,
      name: "",
      summa: 0,
      userProvidedTime: new Date(),
      returnedTime: new Date(),
      phoneNumbers: [{ id: 1, number: "" }],
    });
  };

  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item.id === id);

    setEditingItemId(id);
    setNewItem({
      id: itemToEdit.id,
      name: itemToEdit.name,
      summa: itemToEdit.summa,
      userProvidedTime: new Date(itemToEdit.userProvidedTime),
      returnedTime: new Date(itemToEdit.returnedTime),
      phoneNumbers: itemToEdit.phoneNumbers || [{ id: 1, number: "" }],
    });

    setShowModal(true);
  };

  const handleDelete = (id) => {
    setItemToDeleteId(id);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    const updatedData = data.filter((item) => item.id !== itemToDeleteId);
    setData(updatedData);

    setShowDeleteConfirmation(false);
    setItemToDeleteId(null); // Reset the item to delete ID after deletion
  };

  const cancelDelete = () => {
    setItemToDeleteId(null);
    setShowDeleteConfirmation(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const addPhoneNumberRow = () => {
    const newId =
      newItem.phoneNumbers.length > 0
        ? Math.max(...newItem.phoneNumbers.map((number) => number.id)) + 1
        : 1;

    setNewItem({
      ...newItem,
      phoneNumbers: [...newItem.phoneNumbers, { id: newId, number: "" }],
    });
  };

  const removePhoneNumberRow = (id) => {
    const updatedPhoneNumbers = newItem.phoneNumbers.filter(
      (number) => number.id !== id
    );

    setNewItem({ ...newItem, phoneNumbers: updatedPhoneNumbers });
  };

  return (
    <div className="container">
      <h1>Home</h1>
      <Link to="/archive">Go to Archive</Link>{" "}
      {/* Link komponentini ishlatish */}
      <button onClick={() => setShowModal(true)}>Add</button>
      <table className="rwd-table">
        <tbody>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Summa</th>
            <th>User Provided Time</th>
            <th>Returned Time</th>
            <th>Phone Numbers</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
          {data.map((item) => (
            <tr key={item.id}>
              <td data-th="ID">{item.id}</td>
              <td data-th="Name">{item.name}</td>
              <td data-th="Summa">{item.summa}</td>
              <td data-th="User Provided Time">
                {item.userProvidedTime.toString()}
              </td>
              <td data-th="Returned Time">{item.returnedTime.toString()}</td>
              <td data-th="Phone Numbers">
                {item.phoneNumbers.map((phoneNumber) => (
                  <div key={phoneNumber.id}>
                    {phoneNumber.number}
                    <button
                      onClick={() => removePhoneNumberRow(phoneNumber.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </td>
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
              onChange={(e) =>
                setNewItem({ ...newItem, summa: e.target.value })
              }
            />
            <label>User Provided Time:</label>
            <DatePicker
              selected={newItem.userProvidedTime}
              onChange={(date) =>
                setNewItem({ ...newItem, userProvidedTime: date })
              }
            />
            <label>Returned Time:</label>
            <DatePicker
              selected={newItem.returnedTime}
              onChange={(date) =>
                setNewItem({ ...newItem, returnedTime: date })
              }
            />
            <div>
              <label>Phone Numbers:</label>
              {newItem.phoneNumbers.map((phoneNumber) => (
                <div key={phoneNumber.id}>
                  <input
                    type="text"
                    value={phoneNumber.number}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        phoneNumbers: newItem.phoneNumbers.map((num) =>
                          num.id === phoneNumber.id
                            ? { ...num, number: e.target.value }
                            : num
                        ),
                      })
                    }
                  />
                </div>
              ))}
              <button onClick={addPhoneNumberRow}>Add Phone Number</button>
            </div>
            <button onClick={handleAdd}>Save</button>
          </div>
        </div>
      )}
      {showDeleteConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this item?</p>
            <button onClick={confirmDelete}>Yes</button>
            <button onClick={cancelDelete}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
