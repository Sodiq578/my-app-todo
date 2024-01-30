import React, { useState, useEffect } from "react";
import "./Form.css";

export const Form = () => {
  const [malumotlar, setMalumotlar] = useState(() => {
    const storedMalumotlar = localStorage.getItem("malumotlar");
    return storedMalumotlar ? JSON.parse(storedMalumotlar) : [];
  });

  const [malumot, setMalumot] = useState({ ism: "", sharx: "", summa: 0 });
  const [qidiruv, setQidiruv] = useState("");
  const [qidiruvNatijalari, setQidiruvNatijalari] = useState([]);
  const [editMalumot, setEditMalumot] = useState({ ism: "", sharx: "", summa: 0 });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showAllMalumotlar, setShowAllMalumotlar] = useState(true);
  const [totalSum, setTotalSum] = useState(() => {
    const storedTotalSum = localStorage.getItem("totalSum");
    return storedTotalSum ? parseInt(storedTotalSum) : 0;
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (malumot.ism.trim() === "" || malumot.sharx.trim() === "" || malumot.summa <= 0) {
      alert("Barcha maydonlarni to'ldiring!");
      return;
    }

    const newMalumot = { ...malumot, sanai: new Date() };

    setMalumotlar([...malumotlar, newMalumot]);
    setTotalSum(totalSum + malumot.summa);
    setMalumot({ ism: "", sharx: "", summa: 0 });
  };

  const handleQidirish = () => {
    const natijalar = malumotlar.filter(
      (malumot) =>
        malumot.ism.toLowerCase().includes(qidiruv.toLowerCase()) ||
        malumot.sharx.toLowerCase().includes(qidiruv.toLowerCase())
    );
    setQidiruvNatijalari(natijalar);
    setShowAllMalumotlar(false);
  };

  useEffect(() => {
    localStorage.setItem("malumotlar", JSON.stringify(malumotlar));
    localStorage.setItem("totalSum", totalSum.toString());
  }, [malumotlar, totalSum]);

  useEffect(() => {
    const summa = malumotlar.reduce((total, malumot) => total + malumot.summa, 0);
    setTotalSum(summa);
  }, [malumotlar]);

  const handleEdit = (index) => {
    const editingMalumot = malumotlar[index];
    setEditMalumot({ ism: editingMalumot.ism, sharx: editingMalumot.sharx, summa: editingMalumot.summa });
    setEditingIndex(index);
    setEditModalVisible(true);
  };

  const handleEditSubmit = () => {
    const editedMalumotlar = [...malumotlar];
    editedMalumotlar[editingIndex] = editMalumot;
    setMalumotlar(editedMalumotlar);
    setEditingIndex(null);
    setEditModalVisible(false);
    setEditMalumot({ ism: "", sharx: "", summa: 0 });
  };

  const closeEditModal = () => {
    setEditingIndex(null);
    setEditModalVisible(false);
    setEditMalumot({ ism: "", sharx: "", summa: 0 });
  };

  const handleDelete = (index) => {
    const deletedMalumot = malumotlar[index];
    setMalumotlar(malumotlar.filter((_, i) => i !== index));
    setTotalSum(totalSum - deletedMalumot.summa);
  };

  const handleShowAll = () => {
    setShowAllMalumotlar(!showAllMalumotlar);
    setQidiruvNatijalari([]);
    setQidiruv("");
  };

  const handleClearTotalSum = () => {
    setTotalSum(0);
  };

  const handleDeleteAll = () => {
    setMalumotlar([]);
    setTotalSum(0);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Mijozni ismi..."
          className="input"
          value={malumot.ism}
          onChange={(e) => setMalumot({ ...malumot, ism: e.target.value })}
        />
        <input
          type="text"
          placeholder="Yashash joyini kiriting..."
          className="input"
          value={malumot.sharx}
          onChange={(e) => setMalumot({ ...malumot, sharx: e.target.value })}
        />
        <input
          type="number"
          placeholder="Summani kiriting..."
          className="input"
          value={malumot.summa || ""}
          onChange={(e) => setMalumot({ ...malumot, summa: parseInt(e.target.value) })}
        />
        <button type="submit" className="submit-button">
          Qo'shish
        </button>
      </form>

      <ul className="malumot-list">
        {showAllMalumotlar
          ? malumotlar.map((malumot, index) => (
              <li key={index} onClick={() => setQidiruv(malumot.ism)} className="malumot-item">
                <div className="qoshilgan-malumot">
                  {malumot.ism} - {malumot.sharx} - Summa: {malumot.summa}
                </div>
                <div className="buttons-box">
                  <button onClick={() => handleEdit(index)} className="edit-button">
                    Edit
                  </button>{" "}
                  <button onClick={() => handleDelete(index)} className="delete-button">
                    Delete
                  </button>
                </div>
              </li>
            ))
          : null}
      </ul>

      <div className="search-bar">
        <input 
          type="text"
          placeholder="Izlash..."
          className="input search-input"
          value={qidiruv}
          onChange={(e) => setQidiruv(e.target.value)}
        />
        <button onClick={handleQidirish} className="search-button">
          Izlash &#128269; {/* Unicode for search icon */}
        </button>
        <button onClick={handleShowAll} className="show-all-button">
          {showAllMalumotlar ? "Yashirish" : "Barcha malumotlar"} {showAllMalumotlar ? '👁️' : '🧾'} {/* Unicode for eye icon */}
        </button>
      </div>

      <ul className="search-results">
        {showAllMalumotlar
          ? null
          : qidiruvNatijalari.map((malumot, index) => (
              <li key={index} onClick={() => setQidiruv("")} className="search-result-item">
                {malumot.ism} - {malumot.sharx} - Summa: {malumot.summa}
              </li>
            ))}
      </ul>

      {editModalVisible && (
        <div className="edit-modal">
          <input
            type="text"
            placeholder="Ismingizni kiriting..."
            value={editMalumot.ism}
            onChange={(e) =>
              setEditMalumot({ ...editMalumot, ism: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Sharxingizni kiriting..."
            value={editMalumot.sharx}
            onChange={(e) =>
              setEditMalumot({ ...editMalumot, sharx: e.target.value })
            }
          />
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

      <div className="total-sum">
        <b> Jami Summa: {totalSum.toLocaleString("en-US")} So'm</b>
      </div>

    </div>
  );
};

export default Form;
