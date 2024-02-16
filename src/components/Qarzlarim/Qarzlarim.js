import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Qarzlarim.css";
import Header from "../../layout/Header";
import DatePicker from "react-datepicker";
import PhoneInput from "react-phone-number-input/input"; // Telefon raqam inputi
import "react-phone-number-input/style.css"; // Telefon raqam inputining stili

const Qarzlarim = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [name, setName] = useState('');
  const [from, setFrom] = useState('');
  const [productType, setProductType] = useState('');
  const [amount, setAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [receivedAt, setReceivedAt] = useState(new Date());
  const [lastGivenAmount, setLastGivenAmount] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  
  // Load tableData from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('tableData');
    if (savedData) {
      setTableData(JSON.parse(savedData));
    }
  }, []);

  // Save tableData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tableData', JSON.stringify(tableData));
  }, [tableData]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    clearInputs();
  };

  const clearInputs = () => {
    setName('');
    setFrom('');
    setProductType('');
    setAmount(0);
    setRemainingAmount(0);
    setReceivedAt(new Date());
    setLastGivenAmount(0);
    setPhoneNumber('');
  };

  const handleAdd = () => {
    if (editingItemId !== null) {
      // If editingItemId is not null, it means we are updating an existing item
      const updatedData = tableData.map(item => {
        if (item.id === editingItemId) {
          return { ...item, name, from, productType, amount, remainingAmount, receivedAt, lastGivenAmount, phoneNumber };
        }
        return item;
      });
      setTableData(updatedData);
      setEditingItemId(null);
    } else {
      // Otherwise, we are adding a new item
      const newData = { id: Date.now(), name, from, productType, amount, remainingAmount, receivedAt, lastGivenAmount, phoneNumber };
      setTableData([...tableData, newData]);
    }
    closeModal();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const now = new Date();
    const itemsWithDueDate = tableData.filter((item) => {
      const returnedTime = new Date(item.receivedAt);
      return returnedTime > now;
    });

    if (itemsWithDueDate.length > 0) {
      alert(
        `Qaytarilish vaqti o'tgan buyurtmalar mavjud Ismi: ${itemsWithDueDate
          .map((item) => item.name)
          .join(", ")} \nManzil: ${itemsWithDueDate
          .map((item) => item.from)
          .join(", ")} \nTelefon raqamlar: ${itemsWithDueDate
          .map((item) => item.phoneNumber)
          .join(", ")}`
      );
    }
  }, [tableData]);

  const addPhoneNumberRow = () => {
    const newId =
      tableData.length > 0
        ? Math.max(...tableData.map(item => item.id)) + 1
        : 1;

    const newTableData = tableData.map(item => ({
      ...item,
      phoneNumbers: [...item.phoneNumbers, { id: newId, number: "" }]
    }));

    setTableData(newTableData);
  };

  const calculateTotalSum = () => {
    let totalSum = 0;
    tableData.forEach((item) => {
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

  const handleEdit = (id) => {
    const itemToEdit = tableData.find(item => item.id === id);
    setName(itemToEdit.name);
    setFrom(itemToEdit.from);
    setProductType(itemToEdit.productType);
    setAmount(itemToEdit.amount);
    setRemainingAmount(itemToEdit.remainingAmount);
    setReceivedAt(new Date(itemToEdit.receivedAt));
    setLastGivenAmount(itemToEdit.lastGivenAmount);
    setPhoneNumber(itemToEdit.phoneNumber);
    setEditingItemId(id);
    openModal();
  };

  return (
    <div>
      <Header />
      <div className="container">
        {/* Izlash inputi */}
        <input type="text" placeholder="Izlash..." onChange={handleSearch} />

        {/* Qo'shish tugmasi */}
        <button onClick={openModal}>Qo'shish</button>

        {/* Modal */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <input type="text" value={name} placeholder="Ism" onChange={(e) => setName(e.target.value)} />
              <input type="text" value={from} placeholder="Qayerdan" onChange={(e) => setFrom(e.target.value)} />
              <input type="text" value={productType} placeholder="Maxsulot turi" onChange={(e) => setProductType(e.target.value)} />
              <input type="number" value={amount} placeholder="Summasi" onChange={(e) => setAmount(parseInt(e.target.value))} />
              <input type="number" value={remainingAmount} placeholder="Qolgan summa" onChange={(e) => setRemainingAmount(parseInt(e.target.value))} />
              <DatePicker
                className="vaqt"
                placeholderText="Olingan vaqti"
                selected={receivedAt}
                onChange={(date) => setReceivedAt(date)}
                locale="uz" // O'zbek tilida
              />
              <input type="number" value={lastGivenAmount} placeholder="Oxirig berilagan summa" onChange={(e) => setLastGivenAmount(parseInt(e.target.value))} />
              <PhoneInput
                placeholder="Telefon raqami"
                value={phoneNumber}
                onChange={(phone) => setPhoneNumber(phone)}
                defaultCountry="UZ" // O'zbekiston
              />
              <button onClick={handleAdd}>Saqlash</button>
            </div>
          </div>
        )}

        {/* Jadval */}
        <table className="table">
          <thead>
            <tr>
              <th>Kimdan</th>
              <th>Qayerdan</th>
              <th>Maxsulot turi</th>
              <th>Summasi</th>
              <th>Qolgan summa</th>
              <th>Olingan vaqti</th>
              <th>Oxirig berilagan summa</th>
              <th>Telefon raqami</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {tableData.filter((data) => {
              if (searchTerm === '') {
                return data;
              } else if (data.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                return data;
              }
            }).map((rowData, index) => (
              <tr key={index}>
                <td>{rowData.name}</td>
                <td>{rowData.from}</td>
                <td>{rowData.productType}</td>
                <td>{rowData.amount}</td>
                <td>{rowData.remainingAmount}</td>
                <td>{new Date(rowData.receivedAt).toDateString()}</td> {/* receivedAt ni qayta o'zgaruvchan Date sifatida o'rnatish */}
                <td>{rowData.lastGivenAmount}</td>
                <td>{rowData.phoneNumber}</td>
                <td>
                  <button onClick={() => handleEdit(rowData.id)}>Tahrirlash</button>
                  <button onClick={() => handleDelete(rowData.id)}>O'chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Qarzlarim;
