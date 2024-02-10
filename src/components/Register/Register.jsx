// Register.js
import React, { useState } from 'react';

const Register = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleRegister = () => {
    // Bu joyda yangi foydalanuvchi ro'yxatdan o'tkazilishini va uning ma'lumotlarini saqlashni amalga oshiring
    alert(`Ro'yxatdan muvaffaqiyatli o'tdingiz, ${username}!`);
    onLogin(username);
  };
  
  return (
    <div>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Foydalanuvchi nomi"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Parol"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Ro'yxatdan o'tish</button>
    </div>
  );
};

export default Register;
