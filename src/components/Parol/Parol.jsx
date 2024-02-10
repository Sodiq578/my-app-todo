import React, { useState } from 'react';
import './Parol.css'; // Stil dosyasını içe aktar
import { Font } from 'react-google-fonts';

const Parol = ({ onLogin }) => {
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    onLogin(password);
  };

  return (
  
    <div className="parol-container">
      <div className="particles-js"></div> {/* Parçacık animasyonu konteyneri */}
      <div className="content">
        <h2>Parol</h2>
        <input
          type="password"
          placeholder="Parolni kiriting"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSubmit}>Kirish</button>
      </div>
    </div>
  );
};

export default Parol;
