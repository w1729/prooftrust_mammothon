// @ts-nocheck
import ReactDOM from "react-dom/client";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Pools from "./pages/Pools";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/pool" element={<Pools />} />
    </Routes>
  );
}

export default App;
