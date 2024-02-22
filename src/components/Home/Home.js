import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-number-input/input";
import "react-phone-number-input/style.css";
import "./Home.css";
import { Link } from "react-router-dom";
import Header from "../../layout/Header";

const Home = () => {
  // Komponent holati uchun muhim holatlar
  const [data, setData] = useState([]); // Barcha ma'lumotlar
  const [showModal, setShowModal] = useState(false); // Modal oynani ko'rsatish/yo'q qilish
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // O'chirishni tasdiqlash oynani ko'rsatish/yo'q qilish
  const [newItem, setNewItem] = useState({ // Yangi ma'lumot qo'shish uchun
    name: "",
    summa: "",
    userProvidedTime: new Date(),
    returnedTime: new Date(),
    manzil: "",
    phoneNumbers: [{ id: 1, number: "" }],
  });
  const [editingItemId, setEditingItemId] = useState(null); // Tahrir qilayotgan elementning ID-si
  const [itemToDeleteId, setItemToDeleteId] = useState(null); // O'chirilayotgan elementning ID-si
  const [searchQuery, setSearchQuery] = useState(""); // Qidiruv so'rovi
  const [visibleData, setVisibleData] = useState([]); // Ko'rsatilayotgan ma'lumotlar
  const [selectedCategory, setSelectedCategory] = useState(""); // Tanlangan kategoriya
  const [selectedLanguage, setSelectedLanguage] = useState("uz"); // Default language is "O'zbekcha"
  const [selectedProfile, setSelectedProfile] = useState("profile1"); // Default profile is "Profil 1"
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

  // O'zbek tilidagi hafta kuni va oy nomlari
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

  // Sanani O'zbek tiliga formatlash
  const formatDate = (date) => {
    const day = daysInUzbek[date.getDay()];
    const month = monthsInUzbek[date.getMonth()];
    const formattedDate = `${day}, ${date.getDate()} ${month}`;
    return formattedDate;
  };

  // Ma'lumotlarni olish vaqtida ishga tushadigan effekt
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("yourDataKey")) || [];
    setData(storedData);
    setVisibleData(storedData);
  }, []);

  // Ma'lumotlarga qaytarilish vaqti yetib o'tganlar bo'yicha bildirishnoma chiqarish
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

  // Telefon raqam qatorini qo'shish
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

  // Jami summani hisoblash
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

  // Ma'lumotni o'chirish
  const handleDelete = (id) => {
    if (!showDeleteConfirmation && !editingItemId) {
      setItemToDeleteId(id);
      setShowDeleteConfirmation(true);
    }
  };

  // O'chirishni tasdiqlash
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

  // O'chirishni bekor qilish
  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setItemToDeleteId(null);
  };

  // O'chirishni tasdiqlash oynasini yopish
  const closeDeleteConfirmationModal = () => {
    setShowDeleteConfirmation(false);
    setItemToDeleteId(null);
  };

  // Ma'lumot qo'shish
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

    // Telefon raqamni tekshirish
    const existingCustomer = data.find((item) =>
      item.phoneNumbers.some(
        (phoneNumber) => phoneNumber.number === newItem.phoneNumbers[0].number
      )
    );

    // Agar telefon raqam mavjud bo'lsa, xabarni chiqar
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

  // Ma'lumotni tahrirlash
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

  // Telefon raqamni o'chirish
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

  // Tahrir qilayotgan ma'lumotni saqlash
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

  // Qidiruv
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

  // Ma'lumotlarni qayta tuzish
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

  // ID generatsiyalash
  const generateId = (index) => {
    return index + 1;
  };

  // Kategoriya qo'shish
  const addCategory = (category) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  // Kategoriya tanlash
  const handleCategorySelect = (category) => {
    if (category === "add") {
      const newCategory = prompt("Yangi kategoriya nomini kiriting:");
      if (newCategory) {
        addCategory(newCategory);
        setSelectedCategory(newCategory);
        handleSearch(searchQuery);
      }
    } else {
      setSelectedCategory(category);
      handleSearch(searchQuery);
    }
  };

  return (
    <div className="container">
      {/* Ma'lumotlar qidiruv uchun */}
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

      {/* Sari sahifa sarlavhasi */}
      <Header />

      {/* Ma'lumotlar */}
      <div className="container">
        <div className="wery-bir-box">
          {/* Kategoriyalar */}
          <div className="category">
            <h2>Kategoriyalar</h2>
            {categories.map((category, index) => (
              <p key={index} onClick={() => handleCategorySelect(category)}>
                {category}
              </p>
            ))}
            <p onClick={() => handleCategorySelect("add")}>+ Qo'shish</p>
          </div>

          {/* Ma'lumotlar jadvali */}
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
                ➕ Qo'shish
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
                      <button onClick={() => handleEdit(item.id)}>Tahrir</button>
                      <button onClick={() => handleDelete(item.id)}>O'chirish</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal oynasi */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            {/* Modal ichidagi kontent */}
            <h2>Yangi ma'lumot qo'shish</h2>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Ism"
            />
            <input
              type="text"
              value={newItem.summa}
              onChange={(e) => setNewItem({ ...newItem, summa: e.target.value })}
              placeholder="Summa"
            />
            <input
              type="text"
              value={newItem.manzil}
              onChange={(e) => setNewItem({ ...newItem, manzil: e.target.value })}
              placeholder="Manzil"
            />
            <DatePicker
              selected={newItem.userProvidedTime}
              onChange={(date) => setNewItem({ ...newItem, userProvidedTime: date })}
              placeholderText="Berilish vaqti"
            />
            <DatePicker
              selected={newItem.returnedTime}
              onChange={(date) => setNewItem({ ...newItem, returnedTime: date })}
              placeholderText="Qaytarilish vaqti"
            />
            {newItem.phoneNumbers.map((phone, index) => (
              <div key={phone.id}>
                <PhoneInput
                  placeholder="Telefon raqam"
                  value={phone.number}
                  onChange={(number) => {
                    const updatedPhoneNumbers = [...newItem.phoneNumbers];
                    updatedPhoneNumbers[index].number = number;
                    setNewItem({ ...newItem, phoneNumbers: updatedPhoneNumbers });
                  }}
                />
                <button onClick={() => handleRemovePhoneNumber(phone.id)}>
                  O'chirish
                </button>
              </div>
            ))}
            <button onClick={handleAdd}>Qo'shish</button>
            <button onClick={handleSaveEdit}>Saqlash</button>
          </div>
        </div>
      )}

      {/* O'chirishni tasdiqlash modal oynasi */}
      {showDeleteConfirmation && (
        <div className="delete-confirmation-modal">
          <div className="modal-content">
            <span className="close" onClick={closeDeleteConfirmationModal}>
              &times; 
            </span>
            <p>Haqiqatan ham ushbu ma'lumotni o'chirmoqchimisiz?</p>
            <button onClick={confirmDelete}>Ha</button>
            <button onClick={cancelDelete}>Yo'q</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
