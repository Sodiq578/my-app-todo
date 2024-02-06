// Archive.js
import React from "react";
import { Link } from "react-router-dom";
const Archive = ({ archivedData }) => {
  return (
    <div className="container">
      <Link className="link" to={'/'}>Go to home</Link>
      <h1>Archive</h1>
      <table className="rwd-table">
        {/* Display archived data in a table */}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Archive  
