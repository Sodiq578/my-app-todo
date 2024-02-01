// Home.js

// React va useEffect o'zgaruvchilarini import qilib olish
import React, { useState, useEffect } from "react";
// CSS faylini import qilib olish
import "./Home.css";

// Home funksiyasi
const Home = () => {
  // State lar
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    summa: 0,
    userProvidedTime: "",
    returnedTime: "",
  });
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Komponent mount bo'lganda local storage dan ma'lumotlarni olish
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("yourDataKey")) || [];
    setData(storedData);
  }, []);

  // Ma'lumotlar o'zgarganda local storage ga saqlash
  useEffect(() => {
    localStorage.setItem("yourDataKey", JSON.stringify(data));
  }, [data]);

  // Yangi item qo'shish
  const handleAdd = () => {
    if (editingItemId !== null) {
      // Mavjud itemni tahrirlash
      const updatedData = data.map((item) =>
        item.id === editingItemId ? { ...item, ...newItem } : item
      );
      setData(updatedData);
      setEditingItemId(null);
    } else {
      // Yangi item qo'shish
      const newId =
        data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1;
      setData([...data, { id: newId, ...newItem }]);
    }

    // Modallarni yopish
    setShowModal(false);
    setShowDeleteConfirmation(false);

    // newItem state ni tozalash
    setNewItem({ name: "", summa: 0, userProvidedTime: "", returnedTime: "" });
  };

  // Itemni tahrirlash
  const handleEdit = (id) => {
    // Edit qilish kerakli itemni topish
    const itemToEdit = data.find((item) => item.id === id);

    // Editing item ni o'rnatish va modal maydonlarini to'ldirish
    setEditingItemId(id);
    setNewItem({
      name: itemToEdit.name,
      summa: itemToEdit.summa,
      userProvidedTime: itemToEdit.userProvidedTime,
      returnedTime: itemToEdit.returnedTime,
    });

    // Modalni ochish
    setShowModal(true);
  };

  // Itemni o'chirish
  const handleDelete = (id) => {
    // O'chiriladigan item id ni o'rnatish
    setItemToDeleteId(id);
    // O'chirishni tasdiqlash modalini chiqarish
    setShowDeleteConfirmation(true);
  };

  // O'chirishni tasdiqlash
  const confirmDelete = () => {
    // Berilgan id ga teng bo'lgan itemni filtrlash
    const updatedData = data.filter((item) => item.id !== itemToDeleteId);
    // Ma'lumotlar state ni yangilash
    setData(updatedData);

    // O'chirishni tasdiqlash modalini yopish
    setShowDeleteConfirmation(false);
  };

  // O'chirishni bekor qilish
  const cancelDelete = () => {
    // O'chiriladigan item id ni qayta to'lash
    setItemToDeleteId(null);
    // O'chirishni tasdiqlash modalini yopish
    setShowDeleteConfirmation(false);
  };

  // Qidiruv inputidagi o'zgarishlar
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="container">
      <h1>Home</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Qidirish: "
          className="search-input"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <button className="add-btn" onClick={() => setShowModal(true)}>
          Add ➕
        </button>
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
            .filter(
              (item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.summa.toString().includes(searchQuery) ||
                item.userProvidedTime
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                item.returnedTime
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
            )
            .map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.summa}</td>
                <td>{item.userProvidedTime}</td>
                <td>{item.returnedTime}</td>
                <td className="edit-delite-box">
                  <button onClick={() => handleEdit(item.id)}>
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(item.id)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

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
              onChange={(e) =>
                setNewItem({ ...newItem, summa: parseInt(e.target.value, 10) })
              }
            />
            <br />
            <label>Mijozga berilgan vaqt: </label>
            <input
              type="text"
              placeholder="Mijozga berilgan vaqt"
              value={newItem.userProvidedTime}
              onChange={(e) =>
                setNewItem({ ...newItem, userProvidedTime: e.target.value })
              }
            />
            <br />
            <label>Qaytariladigan vaqt: </label>
            <input
              type="text"
              placeholder="Qaytariladigan vaqt"
              value={newItem.returnedTime}
              onChange={(e) =>
                setNewItem({ ...newItem, returnedTime: e.target.value })
              }
            />
            <br />
            <div>
              <button id="add-btn" className="add-btn" onClick={handleAdd}>
                {editingItemId !== null ? "Edit ✏️" : "Add ➕"}
              </button>
              <button
                id="cancel-btn"
                className="cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel ✖️
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="delete-confirmation">
          <div className="yes-no-box">
              <p className="yes-no-box-title">Haqiqatan ham bu mijozni  oʻchirib tashlamoqchimisiz?</p>
          <div>
            <button className=" " onClick={confirmDelete}>Ha</button>
            <button onClick={cancelDelete}>Yo'q</button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
