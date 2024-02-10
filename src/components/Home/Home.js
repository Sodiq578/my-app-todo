import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import "./Home.css";
import PhoneInput from "react-phone-number-input/input";
import "react-phone-number-input/style.css";

const Home = ({ archivedData, setArchivedData }) => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    summa: "",
    userProvidedTime: new Date(),
    returnedTime: new Date(),
    manzil: "",
    phoneNumbers: [{ id: 1, number: "" }],
  });
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleData, setVisibleData] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("yourDataKey")) || [];
    setData(storedData);
    setVisibleData(rearrangeData(storedData).slice(0, 10));
  }, []);

  useEffect(() => {
    setVisibleData(rearrangeData(data).slice(0, 10));
  }, [data]);

  useEffect(() => {
    const now = new Date();
    const itemsWithDueDate = data.filter((item) => {
      const returnedTime = new Date(item.returnedTime);
      return (
        returnedTime.getFullYear() === now.getFullYear() &&
        returnedTime.getMonth() === now.getMonth() &&
        returnedTime.getDate() === now.getDate()
      );
    });
  
    if (itemsWithDueDate.length > 0) {
      alert(
        `Qaytarilish vaqti o'tgan buyurtmalar mavjud Ismi: ${itemsWithDueDate
          .map((item) => item.name)
          .join(", ")} \nManzil: ${itemsWithDueDate
          .map((item) => item.manzil)
          .join(", ")} \nTelefon raqamlar: ${itemsWithDueDate
          .map((item) => item.phoneNumbers.map((phone) => phone.number))
          .join(", ")}`
      );
  
     
    }
  }, [data]);
  
  const addPhoneNumberRow = () => {
    const newId =
      newItem.phoneNumbers.length > 0
        ? Math.max(...newItem.phoneNumbers.map(number => number.id)) + 1
        : 1;

    setNewItem({
      ...newItem,
      phoneNumbers: [...newItem.phoneNumbers, { id: newId, number: "" }],
    });
  };

  const calculateTotalSum = () => {
    let totalSum = 0;
    visibleData.forEach(item => {
      totalSum += parseFloat(item.summa);
    });
    return totalSum;
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setItemToDeleteId(null);
  };

  const confirmDelete = () => {
    const updatedData = data.filter(item => item.id !== itemToDeleteId);
    setData(updatedData);

    setShowDeleteConfirmation(false);
    setItemToDeleteId(null);
    setVisibleData(rearrangeData(updatedData).slice(0, 10));

    localStorage.setItem("yourDataKey", JSON.stringify(updatedData));
  };

  const handleAdd = () => {
    if (
      newItem.name.trim() === "" ||
      newItem.summa.trim() === "" ||
      newItem.manzil.trim() === ""
    ) {
      alert("Iltimos, barcha kerakli maydonlarni to'ldiring.");
      return;
    }

    const updatedData = [
      ...data,
      {
        id: Math.random().toString(36).substr(2, 9), // Random ID
        ...newItem,
        summa: parseFloat(newItem.summa), // Convert summa to float
      },
    ];

    setData(updatedData);

    setShowModal(false);
    setShowDeleteConfirmation(false);
    setEditingItemId(null);

    setNewItem({
      name: "",
      summa: "",
      userProvidedTime: new Date(),
      returnedTime: new Date(),
      manzil: "",
      phoneNumbers: [{ id: 1, number: "" }],
    });

    localStorage.setItem("yourDataKey", JSON.stringify(updatedData));
  };

  const handleDelete = id => {
    setItemToDeleteId(id);
    setShowDeleteConfirmation(true);
  };

  const handleEdit = id => {
    const itemToEdit = data.find(item => item.id === id);

    setEditingItemId(id);
    setNewItem({
      ...itemToEdit,
      userProvidedTime: new Date(itemToEdit.userProvidedTime),
      returnedTime: new Date(itemToEdit.returnedTime),
    });

    setShowModal(true);
  };

  const handleRemovePhoneNumber = phoneNumberId => {
    if (showModal) {
      const updatedPhoneNumbers = newItem.phoneNumbers.filter(
        phoneNumber => phoneNumber.id !== phoneNumberId
      );
      setNewItem({ ...newItem, phoneNumbers: updatedPhoneNumbers });
    }
  };

  const handleSaveEdit = () => {
    newItem.summa = parseFloat(newItem.summa);

    if (
      newItem.name.trim() === "" ||
      newItem.summa.toString().trim() === "" ||
      newItem.manzil.trim() === ""
    ) {
      alert("Iltimos, barcha kerakli maydonlarni to'ldiring.");
      return;
    }

    const updatedData = data.map(item =>
      item.id === editingItemId ? { ...newItem, summa: parseFloat(newItem.summa) } : item
    );
    setData(updatedData);
    setShowModal(false);
    setEditingItemId(null);

    localStorage.setItem("yourDataKey", JSON.stringify(updatedData));
  };

  const handleSearch = query => {
    setSearchQuery(query);
    const filteredData = data.filter(
      item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.summa.toString().includes(query.toLowerCase()) ||
        item.manzil.toLowerCase().includes(query.toLowerCase()) ||
        item.id.toString().includes(query.toLowerCase())
    );
    setVisibleData(rearrangeData(filteredData).slice(0, 10));
  };

  const rearrangeData = data => {
    const newData = [];
    const idMap = {};
    data.forEach(item => {
      if (!idMap[item.id]) {
        idMap[item.id] = true;
        newData.push(item);
      }
    });
    return newData;
  };

  return (
    <div className="container">
   
      <h2>
        Jami Summa:{" "}
        {calculateTotalSum().toLocaleString("uz-UZ", {
          style: "currency",
          currency: "UZS",
        })}
      </h2>
      {/* <Link className="link" to="/archive">
        Arxivga o'tish
      </Link> */}

      <div className="search__box">
        <input
          type="text"
          placeholder="Qidiruv..."
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          className="search-input"
        />

        <button className="add__button" onClick={() => setShowModal(true)}>
          ➕ Qo'shish
        </button>
      </div>

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
          {visibleData.map(item => (
            <tr
              key={item.id}
              style={{
                backgroundColor:
                  new Date(item.returnedTime).toDateString() ===
                  new Date().toDateString()
                    ? "#FF8E8E"
                    : "white",
              }}
            >
              <td data-th="ID">{item.id}</td>
              <td data-th="Ism">
                <div>
                  <span className="ism">{item.name}</span>
                </div>
              </td>
              <td data-th="Summa">
                <div>
                  <p>{item.summa.toLocaleString("uz-UZ")} so'm</p>
                </div>
              </td>
              <td data-th="Manzil">
                <div>
                  <p>{item.manzil}</p>
                </div>
              </td>
              <td data-th="Berilish vaqt">
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
              <td data-th="Qaytarilish vaqti">
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
                data-th="Telefon raqamlar"
                className="telefon-raqam"
                style={{ display: "flex", flexDirection: "column" }}
              >
                {item.phoneNumbers.map(phoneNumber => (
                  <div key={phoneNumber.id}>
                    <input
                      className="telefon-raqam-inp"
                      type="text"
                      readOnly
                      placeholder="Telefon raqam"
                      value={phoneNumber.number}
                      onChange={e => {
                        const updatedNumbers = newItem.phoneNumbers.map(num =>
                          num.id === phoneNumber.id ? { ...num, number: e.target.value } : num
                        );
                        setNewItem({
                          ...newItem,
                          phoneNumbers: updatedNumbers,
                        });
                      }}
                    />
                    {showModal && (
                      <button onClick={() => handleRemovePhoneNumber(phoneNumber.id)}>
                        Olib tashlash
                      </button>
                    )}
                  </div>
                ))}
              </td>
              <td data-th="Amallar">
                <button onClick={() => handleEdit(item.id)}>
                  <i className="fas fa-edit"></i> Tahrirlash
                </button>
                <button onClick={() => handleDelete(item.id)}>
                  <i className="fas fa-trash-alt"></i> To'langan
                </button>
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
            <label>Ism:</label>
            <input
              type="text"
              value={newItem.name}
              maxLength={40}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
            />
            <label>Summa:</label>
            <input
              type="number"
              value={newItem.summa}
              onChange={e => setNewItem({ ...newItem, summa: e.target.value })}
            />
            <input
              type="text"
              placeholder="Manzil"
              value={newItem.manzil}
              maxLength={40}
              onChange={e => setNewItem({ ...newItem, manzil: e.target.value })}
            />
            <label>Berilish vaqti:</label>
            <DatePicker
              className="vaqt"
              placeholderText="Sana tanlang"
              selected={newItem.userProvidedTime}
              onChange={date => setNewItem({ ...newItem, userProvidedTime: date })}
              locale="ru" // Rus tilida
            />
            <label>Qaytarilish vaqti:</label>

            <DatePicker
              className="vaqt"
              placeholderText="Sana tanlang"
              selected={newItem.returnedTime}
              onChange={date => setNewItem({ ...newItem, returnedTime: date })}
              locale="ru" // Rus tilida
            />
            <div>
              {newItem.phoneNumbers.map(phoneNumber => (
                <div key={phoneNumber.id}>
                  <PhoneInput
                    placeholder="Telefon raqam"
                    className="telefon-raqam-kiritish"
                    value={phoneNumber.number}
                    onChange={value => {
                      const updatedNumbers = newItem.phoneNumbers.map(num =>
                        num.id === phoneNumber.id ? { ...num, number: value } : num
                      );
                      setNewItem({ ...newItem, phoneNumbers: updatedNumbers });
                    }}
                  />
                  {showModal && (
                    <button onClick={() => handleRemovePhoneNumber(phoneNumber.id)}>
                      Olib tashlash
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addPhoneNumberRow}>Telefon raqam qo'shish</button>
            </div>
            {editingItemId ? (
              <button onClick={handleSaveEdit}>Tahrirni saqlash</button>
            ) : (
              <button onClick={handleAdd}>Saqlash</button>
            )}
            <button onClick={() => setShowModal(false)}>Bekor qilish</button>
          </div>
        </div>
      )}
      {showDeleteConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <p>Haqiqatan ham ushbu narsani o'chirmoqchimisiz?</p>
            <button onClick={confirmDelete}>Ha</button>
            <button onClick={cancelDelete}>Yo'q</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
