import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Home/Home";
import Products from "../ProductPrice/Product"
import Parol from "../Parol/Parol";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (password) => {
    const correctPasswords = {
      "ssx191929": "Xurshid aka",
      "kaptiva919": "Sanjar aka"
    };

    const correctPassword = correctPasswords[password];

    if (correctPassword) {
      setLoggedIn(true);
      alert(`Salom, ${correctPassword}!`);
    } else {
      alert("Noto'g'ri parol, iltimos, qaytadan urunib ko'ring.");
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          loggedIn ? (
            <Home />
          ) : (
            <Parol onLogin={(password) => handleLogin(password)} />
          )
        }
      />
      <Route path="/products" element={<Products />} />
    </Routes>
  );
}

export default App;
