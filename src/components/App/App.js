// App.js

import React from "react";
import {
  Route,
  Routes,
} from "react-router-dom";
// import Home from "./components/Home/Home";
// import { Archive } from "./components/Archive/Archive";
import "../App/App";
import Home from "../Home/Home";
import { Archive } from "../Archive/Archive";

function App() {
  return (
    <Routes>
      <Route path="/" index element={<Home />} />
      <Route path="/archive" element={<Archive />} />
    </Routes>
  );
}

export default App;
