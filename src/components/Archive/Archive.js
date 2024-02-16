// Archive.js
import React from "react";
import { Link } from "react-router-dom";

const Archive = ({ archivedData }) => {
  return (
    <div>
      <Link to="/" className="add__button">
        Back
      </Link>
      <h1>Archived Data</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Sum</th>
            <th>Address</th>
            <th>User Provided Time</th>
            <th>Returned Time</th>
            <th>Phone Numbers</th>
          </tr>
        </thead>
        <tbody>
          {archivedData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.summa}</td>
              <td>{item.manzil}</td>
              <td>{item.userProvidedTime}</td>
              <td>{item.returnedTime}</td>
              <td>
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

export default Archive;
