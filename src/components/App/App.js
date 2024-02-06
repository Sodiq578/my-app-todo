// App.js

import React from "react";
import { Routes, Route } from "react-router-dom";
import "../App/App";
import Home from "../Home/Home";
import Archive from "../Archive/Archive";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/archive" element={<Archive/>}/>
      </Routes>
  );
}

export default App;
