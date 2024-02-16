import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Home/Home";
import Products from "../ProductPrice/Products";
import Parol from "../Parol/Parol";
import Header from "../../layout/Header";
import Qarzlarim from "../Qarzlarim/Qarzlarim";

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
    <>
      {/* Header komponentini barcha sahifalarda chaqiramiz */}
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
        <Route path="/qarzlarim" element={<Qarzlarim />} />
      </Routes>
    </>
  );
}

export default App;
