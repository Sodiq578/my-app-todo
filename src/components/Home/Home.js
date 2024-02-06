import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = ({ archivedData, setArchivedData }) => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [newItem, setNewItem] = useState({
    id: 1,
    name: "",
    summa: "",
    userProvidedTime: new Date(),
    returnedTime: new Date(),
    manzil: "", // Manzil qo'shish uchun yangi qo'shimcha maydon
    phoneNumbers: [{ id: 1, number: "" }],
  });
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleData, setVisibleData] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("yourDataKey")) || [];
    setData(storedData);
  }, []);

  useEffect(() => {
    localStorage.setItem("yourDataKey", JSON.stringify(data));
    setVisibleData(data.slice(0, 10)); // Show first 10 items initially
  }, [data]);

  const handleAdd = () => {
    const newId =
      data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1;

    const updatedData = [
      ...data,
      {
        id: newId,
        ...newItem,
      },
    ];

    setData(updatedData);

    setShowModal(false);
    setShowDeleteConfirmation(false);

    setNewItem({
      id: newId + 1, // Yangi element uchun id 1 ortadi
      name: "",
      summa: "",
      userProvidedTime: new Date(),
      returnedTime: new Date(),
      manzil: "", // Yangi element uchun manzil bo'sh qilinadi
      phoneNumbers: [{ id: 1, number: "" }],
    });
  };

  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item.id === id);

    setEditingItemId(id);
    setNewItem({
      ...itemToEdit,
      userProvidedTime: new Date(itemToEdit.userProvidedTime),
      returnedTime: new Date(itemToEdit.returnedTime),
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
    setItemToDeleteId(null);
  };

  const cancelDelete = () => {
    setItemToDeleteId(null);
    setShowDeleteConfirmation(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setVisibleData(filteredData.slice(0, 10)); // Show first 10 filtered items
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

  const handleRemovePhoneNumber = (phoneNumberId) => {
    if (showModal) {
      const updatedPhoneNumbers = newItem.phoneNumbers.filter(
        (phoneNumber) => phoneNumber.id !== phoneNumberId
      );
      setNewItem({ ...newItem, phoneNumbers: updatedPhoneNumbers });
    }
  };

  const handleSaveEdit = () => {
    const updatedData = data.map((item) =>
      item.id === editingItemId ? newItem : item
    );
    setData(updatedData);
    setShowModal(false);
    setEditingItemId(null);
  };

  return (
    <div className="container">
      <h1>Home</h1>
      <Link className="link" to="/archive">
        Arxivga o'tish
      </Link>

      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <button className="add__button" onClick={() => setShowModal(true)}>
        ➕ Add
      </button>
      <table className="rwd-table">
        <tbody>
          <tr>
            <th>ID</th>
            <th>Ism</th>
            <th>Summa</th>
            <th>Manzil</th>
            <th>Berilish vaqt</th>
            <th>Qaytarilish vaqti</th>
            <th>Telefon raqam</th>
            <th>Amallar</th>
          </tr>
          {visibleData.map((item) => (
            <tr key={item.id}>
              <td data-th="ID">{item.id}</td>
              <td data-th="Name">
                <input
                  type="text"
                  value={item.name}
                  maxLength={40}
                  onChange={(e) =>
                    setData(
                      data.map((el) =>
                        el.id === item.id ? { ...el, name: e.target.value } : el
                      )
                    )
                  }
                />
              </td>
              <td data-th="Summa">
                <input
                  type="number"
                  value={item.summa}
                  maxLength={40}
                  onChange={(e) =>
                    setData(
                      data.map((el) =>
                        el.id === item.id
                          ? { ...el, summa: e.target.value }
                          : el
                      )
                    )
                  }
                />
              </td>

              <td data-th="Manzil">
                <input
                  type="text"
                  value={item.manzil}
                  maxLength={40}
                  onChange={(e) =>
                    setData(
                      data.map((el) =>
                        el.id === item.id
                          ? { ...el, manzil: e.target.value }
                          : el
                      )
                    )
                  }
                />
              </td>
              <td data-th="User Provided Time">
                {new Date(item.userProvidedTime).toLocaleDateString("uz-UZ", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                , soat{" "}
                {new Date(item.userProvidedTime).toLocaleTimeString("uz-UZ", {
                  hour: "numeric",
                  minute: "numeric",
                })}
              </td>
              <td data-th="Returned Time">
                {new Date(item.returnedTime).toLocaleDateString("uz-UZ", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                , soat{" "}
                {new Date(item.returnedTime).toLocaleTimeString("uz-UZ", {
                  hour: "numeric",
                  minute: "numeric",
                })}
              </td>
              <td
                data-th="Phone Numbers"
                style={{ display: "flex", flexDirection: "column" }}
              >
                {item.phoneNumbers.map((phoneNumber, index) => (
                  <div key={phoneNumber.id}>
                    <a href={`tel:${phoneNumber.number}`}>
                      {phoneNumber.number}
                    </a>
                    {showModal && (
                      <button
                        onClick={() => handleRemovePhoneNumber(phoneNumber.id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </td>
              <td data-th="Edit">
                <button onClick={() => handleEdit(item.id)}>Edit</button>

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
              maxLength={40}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <label>Summa:</label>
            <input
              type="number"
              value={newItem.summa === 0 ? "" : newItem.summa}
              maxLength={40}
              onChange={(e) =>
                setNewItem({ ...newItem, summa: e.target.value })
              }
            />
            <label>Manzil:</label>
            <input
              type="text"
              value={newItem.manzil}
              maxLength={40}
              onChange={(e) =>
                setNewItem({ ...newItem, manzil: e.target.value })
              }
            />
            <label>User Provided Time:</label>

            <DatePicker
              selected={newItem.userProvidedTime}
              onChange={(date) =>
                setNewItem({ ...newItem, userProvidedTime: date })
              }
              placeholderText="Select a date"
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
                    maxLength={40}
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
            {editingItemId && (
              <button onClick={handleSaveEdit}>Save Edit</button>
            )}
            {!editingItemId && <button onClick={handleAdd}>Save</button>}
            <button onClick={() => setShowModal(false)}>Cancel</button>
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
