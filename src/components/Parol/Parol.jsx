import React, { useState } from 'react';

const Parol = ({ onLogin }) => {
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    onLogin(password);
  };

  return (
    <div>
      <h2>Parol</h2>
      <input
        type="password"
        placeholder="Parolni kiriting"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>Kirish</button>
    </div>
  );
};

export default Parol;

