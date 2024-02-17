import React, { useState, useEffect } from "react";
import "./Qarzlarim.css";
import Header from "../../layout/Header";
import DatePicker from "react-datepicker";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css"; // Stilni import qilish

const Qarzlarim = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [productType, setProductType] = useState("");
  const [amount, setAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [receivedAt, setReceivedAt] = useState(new Date());
  const [lastGivenAmount, setLastGivenAmount] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem("tableData");
      if (savedData) {
        setTableData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error("JSON parse xatosi:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tableData", JSON.stringify(tableData));
  }, [tableData]);

  const confirmDelete = () => {
    if (itemToDeleteId !== null) {
      const updatedData = tableData.filter(
        (item) => item.id !== itemToDeleteId
      );
      setTableData(updatedData);
      setShowDeleteConfirmation(false);
      setItemToDeleteId(null);
    }
  };

  const handleAdd = () => {
    if (editingItemId !== null) {
      const updatedData = tableData.map((item) => {
        if (item.id === editingItemId) {
          return {
            ...item,
            name,
            from,
            productType,
            amount,
            remainingAmount,
            receivedAt,
            lastGivenAmount,
            phoneNumber,
          };
        }
        return item;
      });
      setTableData(updatedData);
      setEditingItemId(null);
    } else {
      const newData = {
        id: Date.now(),
        name,
        from,
        productType,
        amount,
        remainingAmount,
        receivedAt,
        lastGivenAmount,
        phoneNumber,
      };
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    clearInputs();
  };

  const clearInputs = () => {
    setName("");
    setFrom("");
    setProductType("");
    setAmount(0);
    setRemainingAmount(0);
    setReceivedAt(new Date());
    setLastGivenAmount(0);
    setPhoneNumber("");
  };

  const handleInputChange = (field, value) => {
    switch (field) {
      case "name":
        setName(value);
        break;
      case "from":
        setFrom(value);
        break;
      case "productType":
        setProductType(value);
        break;
      case "amount":
        setAmount(parseInt(value));
        break;
      case "lastGivenAmount":
        setLastGivenAmount(parseInt(value));
        break;
      case "remainingAmount":
        setRemainingAmount(parseInt(value));
        break;
      case "receivedAt":
        setReceivedAt(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      default:
        break;
    }
  };

  const handleDateChange = (date) => {
    setReceivedAt(date);
  };

  const handlePhoneChange = (phone) => {
    setPhoneNumber(phone);
  };

  const handleDelete = (id) => {
    if (!showDeleteConfirmation && !editingItemId) {
      setItemToDeleteId(id);
      setShowDeleteConfirmation(true);
    }
  };

  const handleEdit = (id) => {
    const itemToEdit = tableData.find((item) => item.id === id);
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
        <div className="searchbtn-box">
          <input type="text" placeholder="Izlash..." onChange={handleSearch} />
          <button onClick={openModal}>Qo'shish ➕</button>
        </div>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <div>
                <div>Ism</div>
                <input
                  type="text"
                  value={name}
                  placeholder="Ism"
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div>
                <div>Qayerdan</div>
                <input
                  type="text"
                  value={from}
                  placeholder="Qayerdan"
                  onChange={(e) => handleInputChange("from", e.target.value)}
                />
              </div>
              <div>
                <div>Maxsulot turi</div>
                <input
                  type="text"
                  value={productType}
                  placeholder="Maxsulot turi"
                  onChange={(e) => handleInputChange("productType", e.target.value)}
                />
              </div>
              <div>
                <div>Summasi</div>
                <input
                  type="number"
                  value={amount}
                  placeholder="Summasi"
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                />
              </div>
              <div>
                <div>Oxirig berilagan summa</div>
                <input
                  type="number"
                  value={lastGivenAmount}
                  placeholder="Oxirig berilagan summa"
                  onChange={(e) => handleInputChange("lastGivenAmount", e.target.value)}
                />
              </div>
              <div>
                <div>Qolgan summa</div>
                <input
                  type="number"
                  value={remainingAmount}
                  placeholder="Qolgan summa"
                  onChange={(e) => handleInputChange("remainingAmount", e.target.value)}
                />
              </div>
              <div>
                <div>Olingan vaqti</div>
                <DatePicker
                  className="vaqt"
                  placeholderText="Olingan vaqti"
                  selected={receivedAt}
                  onChange={(date) => handleDateChange(date)}
                  locale="uz"
                />
              </div>
              <div>
                <div>Telefon raqami</div>
                <PhoneInput
                  placeholder="Telefon raqami"
                  value={phoneNumber}
                  onChange={(phone) => handlePhoneChange(phone)}
                  defaultCountry="UZ"
                />
              </div>
              <button onClick={handleAdd}>Saqlash ✅</button>
            </div>
          </div>
        )}

        <table className="table">
          <thead>
            <tr>
              <th data-label="Ism">Ism</th>
              <th data-label="Qayerdan">Qayerdan</th>
              <th data-label="Maxsulot turi">Maxsulot turi</th>
              <th data-label="Summasi">Summasi</th>
              <th data-label="Oxirig berilagan summa">Oxirig berilagan summa</th>
              <th data-label="Qolgan summa">Qolgan summa</th>
              <th data-label="Olingan vaqti">Olingan vaqti</th>
              <th data-label="Telefon raqami">Telefon raqami</th>
              <th data-label="Amallar">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {tableData
              .filter((val) => {
                if (searchTerm === "") {
                  return val;
                } else if (
                  val.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  val.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  val.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  val.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
                ) {
                  return val;
                }
              })
              .map((data) => (
                <tr key={data.id}>
                  <td data-label="Ism">
                    <div>{data.name}</div>
                  </td>
                  <td data-label="Qayerdan">
                    <div>{data.from}</div>
                  </td>
                  <td data-label="Maxsulot turi">
                    <div>{data.productType}</div>
                  </td>
                  <td data-label="Summasi">
                    <div>{data.amount}</div>
                  </td>
                  <td data-label="Oxirig berilagan summa">
                    <div>{data.lastGivenAmount}</div>
                  </td>
                  <td data-label="Qolgan summa">
                    <div>{data.remainingAmount}</div>
                  </td>
                  <td data-label="Olingan vaqti">
                    <div>
                      {data.receivedAt
                        ? new Date(data.receivedAt).toLocaleDateString()
                        : ""}
                    </div>
                  </td>
                  <td data-label="Telefon raqami">
                    <div>{data.phoneNumber}</div>
                  </td>
                  <td className="ammallar-box" data-label="Amallar">
                    <button className="ammalar-btn" onClick={() => handleEdit(data.id)}>✏️</button>
                    <button className="ammalar-btn" onClick={() => handleDelete(data.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {showDeleteConfirmation && (
          <div className="delete-confirmation">
            <p>Rostdan ham bu ma'lumotni o'chirmoqchimisiz?</p>
            <div>
              <button onClick={confirmDelete}>Ha</button>
              <button onClick={() => setShowDeleteConfirmation(false)}>Yo'q</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Qarzlarim;
