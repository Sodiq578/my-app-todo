import React from "react";
import { Link } from "react-router-dom";

const Archive = ({ archivedData, setArchivedData }) => {

  const handleAdd = () => {
    const deletedData = JSON.parse(localStorage.getItem("deletedDataKey"));
    if (deletedData && deletedData.length > 0) {
      const lastDeletedItem = deletedData.pop();
      const updatedArchivedData = [...archivedData, lastDeletedItem];
      setArchivedData(updatedArchivedData);
      localStorage.setItem("archivedDataKey", JSON.stringify(updatedArchivedData));
      localStorage.setItem("deletedDataKey", JSON.stringify(deletedData));
    }
  };

  return (
    <div className="container">
      <Link className="link" to={'/'}>Home sahifasiga qaytish</Link>
      <h1>Archive</h1>
 
      <table className="rwd-table">
        <tbody>
          <tr>
            <th>ID</th>
            <th>Ism</th>
            <th>Summa</th>
            <th>Berilish vaqti</th>
            <th>Qaytarilish vaqti</th>
            <th>Telefon raqam</th>
          </tr>
          {archivedData?.map((item) => (
            <tr key={item.id}>
              <td data-th="ID">{item.id}</td>
              <td data-th="Name">{item.name}</td>
              <td data-th="Summa">{item.summa}</td>
              <td data-th="User Provided Time">
                {item.userProvidedTime.toString()}
              </td>
              <td data-th="Returned Time">{item.returnedTime.toString()}</td>
              <td data-th="Phone Numbers">
                {item.phoneNumbers.map((phoneNumber) => (
                  <div key={phoneNumber.id}>{phoneNumber.number}</div>
                ))}
              </td>
              <td data-th="Delete">
                <button onClick={() => (item.id)}>To'landi</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Archive;
