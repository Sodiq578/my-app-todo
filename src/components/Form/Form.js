import React, { useState, useEffect } from "react";
import "./Form.css";

export const Form = () => {
  // Malumotlarni saqlash uchun state
  const [malumotlar, setMalumotlar] = useState(() => {
    const storedMalumotlar = localStorage.getItem("malumotlar");
    return storedMalumotlar ? JSON.parse(storedMalumotlar) : [];
  });

  // Foydalanuvchi ismi, sharx va summa saqlash uchun state
  const [malumot, setMalumot] = useState({ ism: "", sharx: "", summa: 0 });
  // Qidirish so'rovi uchun state
  const [qidiruv, setQidiruv] = useState("");
  // Qidiruv natijalari uchun state
  const [qidiruvNatijalari, setQidiruvNatijalari] = useState([]);
  // Nomni o'zgartirish uchun state
  const [editMalumot, setEditMalumot] = useState({ ism: "", sharx: "", summa: 0 });
  // Tahrirlash oynasini chiqarish uchun state
  const [editModalVisible, setEditModalVisible] = useState(false);
  // Tahrirlash qilinadigan malumotni saqlash uchun state
  const [editingIndex, setEditingIndex] = useState(null);
  // Barcha malumotlarni ko'rsatish uchun state
  const [showAllMalumotlar, setShowAllMalumotlar] = useState(true);
  // Yig'ilgan summa
  const [totalSum, setTotalSum] = useState(() => {
    const storedTotalSum = localStorage.getItem("totalSum");
    return storedTotalSum ? parseInt(storedTotalSum) : 0;
  });

  // Formani yuborish bosqichida ishlaydigan funksiya
  const handleSubmit = (e) => {
    e.preventDefault();

    // Foydalanuvchidan kiritilgan malumotlarni tekshirish
    if (malumot.ism.trim() === "" || malumot.sharx.trim() === "" || malumot.summa <= 0) {
      alert("Barcha maydonlarni to'ldiring!");
      return;
    }

    // Malumotlarni qo'shish
    setMalumotlar([...malumotlar, malumot]);
    setTotalSum(totalSum + malumot.summa);
    setMalumot({ ism: "", sharx: "", summa: 0 });
  };

  // Qidirish uchun funksiya
  const handleQidirish = () => {
    const natijalar = malumotlar.filter(
      (malumot) =>
        malumot.ism.toLowerCase().includes(qidiruv.toLowerCase()) ||
        malumot.sharx.toLowerCase().includes(qidiruv.toLowerCase())
    );
    setQidiruvNatijalari(natijalar);
    setShowAllMalumotlar(false);
  };

  // useEffect orqali malumotlarni local storage'ga saqlash
  useEffect(() => {
    localStorage.setItem("malumotlar", JSON.stringify(malumotlar));
    localStorage.setItem("totalSum", totalSum.toString());
  }, [malumotlar, totalSum]);

  // useEffect orqali jami summani malumotlardan hisoblash
  useEffect(() => {
    const summa = malumotlar.reduce((total, malumot) => total + malumot.summa, 0);
    setTotalSum(summa);
  }, [malumotlar]);

  // Malumotni o'zgartirish uchun funksiya
  const handleEdit = (index) => {
    const editingMalumot = malumotlar[index];
    setEditMalumot({ ism: editingMalumot.ism, sharx: editingMalumot.sharx, summa: editingMalumot.summa });
    setEditingIndex(index);
    setEditModalVisible(true);
  };

  // Tahrirlashni saqlash uchun funksiya
  const handleEditSubmit = () => {
    const editedMalumotlar = [...malumotlar];
    editedMalumotlar[editingIndex] = editMalumot;
    setMalumotlar(editedMalumotlar);
    setEditingIndex(null);
    setEditModalVisible(false);
    setEditMalumot({ ism: "", sharx: "", summa: 0 });
  };

  // Tahrirlashni bekor qilish uchun funksiya
  const closeEditModal = () => {
    setEditingIndex(null);
    setEditModalVisible(false);
    setEditMalumot({ ism: "", sharx: "", summa: 0 });
  };

  // Malumotni o'chirish uchun funksiya
  const handleDelete = (index) => {
    const deletedMalumot = malumotlar[index];
    setMalumotlar(malumotlar.filter((_, i) => i !== index));
    setTotalSum(totalSum - deletedMalumot.summa);
  };

  // Barcha malumotlarni ko'rsatish uchun funksiya
  const handleShowAll = () => {
    setShowAllMalumotlar(!showAllMalumotlar);
    setQidiruvNatijalari([]);
    setQidiruv("");
  };

  // Summani o'chirish uchun funksiya
  const handleClearTotalSum = () => {
    setTotalSum(0);
  };

  // Barcha malumotlarni o'chirish uchun funksiya
  const handleDeleteAll = () => {
    setMalumotlar([]);
    setTotalSum(0);
  };

  return (
    <div className="form-container">
      {/* Forma yuborish uchun ishlatilgan form elementi */}
      <form onSubmit={handleSubmit} className="form">
        {/* Foydalanuvchi ismi kiritish uchun input */}
        <input
          type="text"
          placeholder="Ismingizni kiriting..."
          className="input"
          value={malumot.ism}
          onChange={(e) => setMalumot({ ...malumot, ism: e.target.value })}
        />
        {/* Sharx kiritish uchun input */}
        <input
          type="text"
          placeholder="Sharxingizni kiriting..."
          className="input"
          value={malumot.sharx}
          onChange={(e) => setMalumot({ ...malumot, sharx: e.target.value })}
        />
        {/* Summa kiritish uchun input */}
        <input
  type="number"
  placeholder="Summani kiriting..."
  className="input"
  value={malumot.summa || ""}
  onChange={(e) => setMalumot({ ...malumot, summa: parseInt(e.target.value) })}
/>
        {/* Formani yuborish uchun tugma */}
        <button type="submit" className="submit-button">
          Yuborish
        </button>
      </form>

      {/* Yuborilgan malumotlarni ko'rsatish */}
      <ul className="malumot-list">
        {showAllMalumotlar
          ? malumotlar.map((malumot, index) => (
              <li key={index} onClick={() => setQidiruv(malumot.ism)} className="malumot-item">
                {malumot.ism} - {malumot.sharx} - Summa: {malumot.summa}{" "}
                <button onClick={() => handleEdit(index)} className="edit-button">
                  Edit
                </button>{" "}
                <button onClick={() => handleDelete(index)} className="delete-button">
                  Delete
                </button>
              </li>
            ))
          : null}
      </ul>

      {/* Qidiruv qatori */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Izlash..."
          className="input"
          value={qidiruv}
          onChange={(e) => setQidiruv(e.target.value)}
        />
        <button onClick={handleQidirish} className="search-button">
          Izlash
        </button>
        {/* Barcha malumotlarni ko'rsatish tugmasi */}
        <button onClick={handleShowAll} className="show-all-button">
          {showAllMalumotlar ? "Yashirish" : "Barcha malumotlar"}
        </button>
      </div>

      {/* Qidiruv natijalari */}
      <ul className="search-results">
        {showAllMalumotlar
          ? null
          : qidiruvNatijalari.map((malumot, index) => (
              <li key={index} onClick={() => setQidiruv("")} className="search-result-item">
                {malumot.ism} - {malumot.sharx} - Summa: {malumot.summa}
              </li>
            ))}
      </ul>

      {/* Malumotni o'zgartirish modal */}
      {editModalVisible && (
        <div className="edit-modal">
          {/* Foydalanuvchi ismi o'zgartirish uchun input */}
          <input
            type="text"
            placeholder="Ismingizni kiriting..."
            value={editMalumot.ism}
            onChange={(e) =>
              setEditMalumot({ ...editMalumot, ism: e.target.value })
            }
          />
          {/* Sharx o'zgartirish uchun input */}
          <input
            type="text"
            placeholder="Sharxingizni kiriting..."
            value={editMalumot.sharx}
            onChange={(e) =>
              setEditMalumot({ ...editMalumot, sharx: e.target.value })
            }
          />
          {/* Summa o'zgartirish uchun input */}
          <input
            type="number"
            placeholder="Summani kiriting..."
            value={editMalumot.summa}
            onChange={(e) =>
              setEditMalumot({ ...editMalumot, summa: parseInt(e.target.value) })
            }
          />
          <button onClick={handleEditSubmit} className="save-button">
            Saqlash
          </button>
          <button onClick={closeEditModal} className="cancel-button">
            Bekor qilish
          </button>
        </div>
      )}

      {/* Jami summa */}
      <div className="total-sum">
        Jami Summa: {totalSum}
      </div>
    </div>
  );
};

export default Form;
