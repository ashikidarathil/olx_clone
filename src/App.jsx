import { Routes, Route } from "react-router-dom";
import Home from "./components/Pages/Home.jsx";
import Details from "./components/Details/Details.jsx"; 
import 'flowbite';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/details" element={<Details/>} />
    </Routes>
  );
}