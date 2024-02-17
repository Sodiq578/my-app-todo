import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-number-input/input";
import "react-phone-number-input/style.css";
import "./Home.css";
import { Link } from "react-router-dom";
import Header from "../../layout/Header";

const Home = ({ setArchivedData }) => {
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

  const daysInUzbek = [
    "Yakshanba",
    "Dushanba",
    "Seshanba",
    "Chorshanba",
    "Payshanba",
    "Juma",
    "Shanba",
  ];
  const monthsInUzbek = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];

  const formatDate = (date) => {
    const day = daysInUzbek[date.getDay()];
    const month = monthsInUzbek[date.getMonth()];
    const formattedDate = `${day} (${date.getDate()} - ${month})`;
    return formattedDate;
  };

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("yourDataKey")) || [];
    setData(storedData);
    setVisibleData(storedData);
  }, []);

  useEffect(() => {
    const now = new Date();
    const itemsWithDueDate = data.filter((item) => {
      const returnedTime = new Date(item.returnedTime);
      return returnedTime > now;
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
        ? newItem.phoneNumbers[newItem.phoneNumbers.length - 1].id + 1
        : 1;

    setNewItem({
      ...newItem,
      phoneNumbers: [...newItem.phoneNumbers, { id: newId, number: "" }],
    });
  };

  const calculateTotalSum = () => {
    let totalSum = 0;
    data.forEach((item) => {
      totalSum += parseFloat(item.summa);
    });
    return totalSum.toLocaleString("uz-UZ", {
      style: "currency",
      currency: "UZS",
    });
  };

  const handleDelete = (id) => {
    if (!showDeleteConfirmation && !editingItemId) {
      setItemToDeleteId(id);
      setShowDeleteConfirmation(true);
    }
  };

  const confirmDelete = () => {
    if (itemToDeleteId !== null) {
      const updatedData = data.filter((item) => item.id !== itemToDeleteId);
      setData(updatedData);

      setShowDeleteConfirmation(false);
      setItemToDeleteId(null);
      setVisibleData(rearrangeData(updatedData).slice(0, 10));

      localStorage.setItem("yourDataKey", JSON.stringify(updatedData));
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setItemToDeleteId(null);
  };

  const closeDeleteConfirmationModal = () => {
    setShowDeleteConfirmation(false);
    setItemToDeleteId(null);
  };

  const handleAdd = () => {
    if (
      newItem.name.trim() === "" ||
      isNaN(parseFloat(newItem.summa)) ||
      newItem.manzil.trim() === ""
    ) {
      alert(
        "Iltimos, barcha kerakli maydonlarni to'ldiring va Summa uchun raqam kiriting."
      );
      return;
    }

    const updatedData = [
      ...data,
      {
        id: generateId(data.length),
        ...newItem,
        summa: parseFloat(newItem.summa),
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

  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item.id === id);

    setEditingItemId(id);
    setNewItem((prevItem) => ({
      ...prevItem,
      ...itemToEdit,
      userProvidedTime: new Date(itemToEdit.userProvidedTime),
      returnedTime: new Date(itemToEdit.returnedTime),
    }));

    setShowModal(true);
  };

  const markAsPaid = (id) => {
    const updatedData = data.map((item) =>
      item.id === id ? { ...item, paid: true } : item
    );
    setData(updatedData);
    localStorage.setItem("yourDataKey", JSON.stringify(updatedData));
  };

  const handleRemovePhoneNumber = (phoneNumberId) => {
    if (showModal) {
      const updatedPhoneNumbers = newItem.phoneNumbers.filter(
        (phoneNumber) => phoneNumber.id !== phoneNumberId
      );
      setNewItem((prevItem) => ({
        ...prevItem,
        phoneNumbers: updatedPhoneNumbers,
      }));
    }
  };

  const handleSaveEdit = () => {
    newItem.summa = parseFloat(newItem.summa);

    if (
      newItem.name.trim() === "" ||
      isNaN(parseFloat(newItem.summa)) ||
      newItem.manzil.trim() === ""
    ) {
      alert(
        "Iltimos, barcha kerakli maydonlarni to'ldiring va Summa uchun raqam kiriting."
      );
      return;
    }

    const updatedData = data.map((item) =>
      item.id === editingItemId
        ? { ...newItem, summa: parseFloat(newItem.summa) }
        : item
    );
    setData(updatedData);
    setShowModal(false);
    setEditingItemId(null);

    localStorage.setItem("yourDataKey", JSON.stringify(updatedData));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredData = data.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.summa.toString().includes(query.toLowerCase()) ||
        item.manzil.toLowerCase().includes(query.toLowerCase()) ||
        item.id.toString().includes(query.toLowerCase())
    );
    setVisibleData(rearrangeData(filteredData).slice(0, 10));
  };

  const rearrangeData = (data) => {
    const newData = [];
    const idMap = {};
    data.forEach((item) => {
      if (!idMap[item.id]) {
        idMap[item.id] = true;
        newData.push(item);
      }
    });
    return newData;
  };

  const generateId = (index) => {
    return index + 1;
  };

  return (
    <div>
      <Header />
      <div className="container">
        <h2 className="total-sum">
          Jami Summa:{" "}
          {calculateTotalSum().toLocaleString("uz-UZ", {
            currency: "UZS",
          })}
        </h2>
        <div className="search__box">
          <input
            type="text"
            placeholder="Qidiruv..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
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
            {visibleData.map((item, index) => (
              <tr
                key={item.id}
                style={{
                  backgroundColor:
                    showModal || item.id === itemToDeleteId
                      ? "#9395D3"
                      : new Date(item.returnedTime) > new Date() &&
                        item.id !== editingItemId
                      ? "#FF8E8E"
                      : "white",
                }}
              >
                <td data-th="ID">{index + 1}</td>
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
                  {formatDate(new Date(item.userProvidedTime))},{" "}
                  {new Date(item.userProvidedTime).getFullYear()} yil, soat{" "}
                  {new Date(item.userProvidedTime).toLocaleTimeString("uz-UZ", {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </td>
                <td data-th="Qaytarilish vaqti">
                  {formatDate(new Date(item.returnedTime))},{" "}
                  {new Date(item.returnedTime).getFullYear()} yil, soat{" "}
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
                  {item.phoneNumbers.map((phoneNumber) => (
                    <div key={phoneNumber.id}>
                      <input
                        className="telefon-raqam-inp"
                        type="text"
                        readOnly
                        placeholder="Telefon raqam"
                        value={phoneNumber.number}
                        onChange={(e) => {
                          const updatedNumbers = newItem.phoneNumbers.map(
                            (num) =>
                              num.id === phoneNumber.id
                                ? { ...num, number: e.target.value }
                                : num
                          );
                          setNewItem({
                            ...newItem,
                            phoneNumbers: updatedNumbers,
                          });
                        }}
                      />
                      {showModal && (
                        <button
                          onClick={() =>
                            handleRemovePhoneNumber(phoneNumber.id)
                          }
                        >
                          Olib tashlash
                        </button>
                      )}
                    </div>
                  ))}
                </td>
                
                <td className="ammallar-box" data-th="Amallar">  <button className="ammalar-btn" onClick={() => handleEdit(item.id)}>
                    <i className="fas fa-edit"></i> ✏️
                  </button>
                 
                  <button className="ammalar-btn" onClick={() => handleDelete(item.id)}>
                    <i className="fas fa-trash-alt"></i> ✅
                  </button></td>
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
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
              />
              <label>Summa:</label>
              <input
                type="number"
                value={newItem.summa}
                onChange={(e) =>
                  setNewItem({ ...newItem, summa: e.target.value })
                }
              />
              <label>Manzil</label>
              <input
                type="text"
                value={newItem.manzil}
                maxLength={40}
                onChange={(e) =>
                  setNewItem({ ...newItem, manzil: e.target.value })
                }
              />
              <label>Berilish vaqti:</label>
              <DatePicker
                className="vaqt"
                placeholderText="Sana tanlang"
                selected={newItem.userProvidedTime}
                onChange={(date) =>
                  setNewItem({ ...newItem, userProvidedTime: date })
                }
                locale="ru" // Rus tilida
              />
              <label>Qaytarilish vaqti:</label>
              <DatePicker
                className="vaqt"
                placeholderText="Sana tanlang"
                selected={newItem.returnedTime}
                onChange={(date) =>
                  setNewItem({ ...newItem, returnedTime: date })
                }
                locale="ru" // Rus tilida
              />
              <div>
                {newItem.phoneNumbers.map((phoneNumber) => (
                  <div className="modal__buttons-box" key={phoneNumber.id}>
                    <PhoneInput
                      placeholder="Telefon raqam"
                      className="telefon-raqam-kiritish"
                      value={phoneNumber.number}
                      onChange={(value) => {
                        const updatedNumbers = newItem.phoneNumbers.map((num) =>
                          num.id === phoneNumber.id
                            ? { ...num, number: value }
                            : num
                        );
                        setNewItem({
                          ...newItem,
                          phoneNumbers: updatedNumbers,
                        });
                      }}
                    />
                    {showModal && (
                      <button
                        onClick={() => handleRemovePhoneNumber(phoneNumber.id)}
                      >
                        Telefon raqamni Olib tashlash ➖
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={addPhoneNumberRow}>
                  Telefon raqam qo'shish 📞 ➕
                </button>
              </div>
              {editingItemId ? (
                <button onClick={handleSaveEdit}>Tahrirni saqlash</button>
              ) : (
                <button onClick={handleAdd}>Saqlash ✅</button>
              )}
              <button
                className="bekorqilish"
                onClick={() => setShowModal(false)}
              >
                Bekor qilish
              </button>
            </div>
          </div>
        )}
        {showDeleteConfirmation && (
          <div className="modal">
            <div className="modal-content">
              <p>Haqiqatan ham ushbu mijozni qarzi to'langanmi</p>
              <button onClick={confirmDelete}>Ha</button>
              <button onClick={cancelDelete}>Yo'q</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
