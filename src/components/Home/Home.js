import { MdOutlineModeEdit, MdOutlineDelete } from "react-icons/md";
import { IoAddCircle } from "react-icons/io5";

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-number-input/input";
import "react-phone-number-input/style.css";
import "./Home.css";
import { Link } from "react-router-dom";
import Header from "../../layout/Header";

const Home = () => {
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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("uz");
  const [selectedProfile, setSelectedProfile] = useState("profile1");
  const [categories, setCategories] = useState([
    "jobu",
    "markaz",
    "qorliq",
    "marmin",
    "savxoz",
    "mo'minqul",
    "chep",
    "ipoq",
  ]);

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
    const formattedDate = `${day}, ${date.getDate()} ${month}`;
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
      return returnedTime < now;
    });

    if (itemsWithDueDate.length > 0) {
      alert(
        `Qaytarilish vaqti o'tgan buyurtmalar mavjud: \n\n${itemsWithDueDate
          .map(
            (item) =>
              `Ism: ${item.name}, Manzil: ${
                item.manzil
              }, Telefon raqam: ${item.phoneNumbers
                .map((phone) => phone.number)
                .join(", ")}`
          )
          .join("\n\n")}`
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

    const existingCustomer = data.find((item) =>
      item.phoneNumbers.some(
        (phoneNumber) => phoneNumber.number === newItem.phoneNumbers[0].number
      )
    );

    if (existingCustomer) {
      alert(
        `Bu telefon raqami allaqachon "${
          existingCustomer.name
        }" mijoziga tegishli.\nIsm: ${existingCustomer.name}\nManzil: ${
          existingCustomer.manzil
        }\nTelefon raqam: ${existingCustomer.phoneNumbers
          .map((phone) => phone.number)
          .join(", ")}`
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
        (item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.summa.toString().includes(query.toLowerCase()) ||
          item.manzil.toLowerCase().includes(query.toLowerCase()) ||
          item.id.toString().includes(query.toLowerCase())) &&
        (selectedCategory === "" || item.manzil === selectedCategory)
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

  const addCategory = (category) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  const removeCategory = (category) => {
    const updatedCategories = categories.filter((cat) => cat !== category);
    setCategories(updatedCategories);
  };

  const handleCategorySelect = (category) => {
    if (category === "add") {
      const newCategory = prompt("Yangi kategoriya nomini kiriting:");
      if (newCategory) {
        addCategory(newCategory);
        setSelectedCategory(newCategory);
        handleSearch(searchQuery);
      }
    } else if (category === "delete") {
      const categoryToDelete = prompt(
        "O'chirmoqchi bo'lgan kategoriyani kiriting:"
      );
      if (categoryToDelete && categories.includes(categoryToDelete)) {
        removeCategory(categoryToDelete);
        setSelectedCategory("");
        handleSearch(searchQuery);
      } else {
        alert("Kategoriya topilmadi yoki mavjud emas.");
      }
    } else {
      setSelectedCategory(category);
      handleSearch(searchQuery);
    }
  };

  return (
    <div className="container">
      <div className="container header-top">
        <div className="search-language-container">
          <input
            type="search"
            placeholder="Qidiruv..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <Header />

      <div className="container">
        <div className="wery-bir-box">
          <div className="category">
            <h2>Kategoriyalar</h2>
            {categories.map((category, index) => (
              <p key={index} onClick={() => handleCategorySelect(category)}>
                {category}
              </p>
            ))}
            <p onClick={() => handleCategorySelect("add")}>+ Qo'shish</p>
            <p onClick={() => handleCategorySelect("delete")}>- O'chirish</p>
          </div>

          <div className="table-big-box">
            <div className="search__box">
              <h2 className="total-sum">
                Jami Summa:{" "}
                {calculateTotalSum().toLocaleString("uz-UZ", {
                  currency: "UZS",
                })}
              </h2>
              <button
                className="add__button"
                onClick={() => setShowModal(true)}
              >
                <IoAddCircle /> Qo'shish
              </button>
            </div>
            <table className="rwd-table">
              <tbody>
                <tr>
                  <th>N/O</th>
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
                        selectedCategory === item.manzil
                          ? "#FFFFFF"
                          : showModal || item.id === itemToDeleteId
                          ? "#9395D3"
                          : new Date(item.returnedTime) > new Date()
                          ? "white"
                          : "#FF8E8E",
                      color:
                        new Date(item.returnedTime) < new Date()
                          ? "white"
                          : "black",
                    }}
                  >
                    <td data-th="N/O">{index + 1}</td>
                    <td data-th="Ism">{item.name}</td>
                    <td data-th="Summa">{item.summa}</td>
                    <td data-th="Manzil">{item.manzil}</td>
                    <td data-th="Berilish vaqt">
                      {formatDate(new Date(item.userProvidedTime))}
                    </td>
                    <td data-th="Qaytarilish vaqti">
                      {formatDate(new Date(item.returnedTime))}
                    </td>
                    <td data-th="Telefon raqam">
                      {item.phoneNumbers.map((phone, index) => (
                        <p key={index}>{phone.number}</p>
                      ))}
                    </td>
                    <td data-th="Amallar">
                      <button
                        className="edit__button"
                        onClick={() => handleEdit(item.id)}
                      >
                        <MdOutlineModeEdit />
                      </button>
                      <button
                        className="delete__button"
                        onClick={() => handleDelete(item.id)}
                      >
                        <MdOutlineDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
  <div className="modal">
    <div className="modal-content">
      <div className="modal-header">
        <span className="close" onClick={() => setShowModal(false)}>
          &times;
        </span>
        <p className="modal-title">Yangi ma'lumot qo'shish</p>
      </div>
      <div className="modal-body">
        <div className="input-row">
          <input
            type="text"
            placeholder="Ism"
            value={newItem.name}
            onChange={(e) =>
              setNewItem({ ...newItem, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Summa"
            value={newItem.summa}
            onChange={(e) =>
              setNewItem({ ...newItem, summa: e.target.value })
            }
          />
        </div>
        <div className="input-row">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Kategoriya tanlang</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          {/* Assuming PhoneInput needs phoneNumber */}
          <PhoneInput
            placeholder="Telefon raqam"
            value={newItem.phoneNumber} // Or wherever phoneNumber is coming from
            onChange={(value) => setNewItem({ ...newItem, phoneNumber: value })}
          />
        </div>
        <div className="input-row">
          <DatePicker
            selected={newItem.userProvidedTime}
            onChange={(date) =>
              setNewItem({ ...newItem, userProvidedTime: date })
            }
          />
          <DatePicker
            selected={newItem.returnedTime}
            onChange={(date) =>
              setNewItem({ ...newItem, returnedTime: date })
            }
          />
        </div>
        {newItem.phoneNumbers.map((phoneNumber, index) => (
          <div className="input-row" key={index}>
           
          </div>
        ))}
       
        {editingItemId !== null ? (
          <button onClick={handleSaveEdit}>Saqlash</button>
        ) : (
          <button onClick={handleAdd}>Qo'shish</button>
        )}
      </div>
    </div>
  </div>
)}


      {showDeleteConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeDeleteConfirmationModal}>
              &times;
            </span>
            <h2>O'chirishni tasdiqlang</h2>
            <p>Rostan ham bu elementni o'chirmoqchimisiz?</p>
            <button className="delete__button" onClick={confirmDelete}>
              Ha
            </button>
            <button className="edit__button" onClick={cancelDelete}>
              Yo'q
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
