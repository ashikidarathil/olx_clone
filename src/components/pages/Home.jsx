import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar"
import Login from "../modal/login";
import Sell from "../modal/Sell";
import Card from "../card/Card";
import { itemsContext } from "../context/Item";

export default function Home() {
  const [openModal, setModal] = useState(false);
  const [openModalSell, setModalSell] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); // New state for category filter

  const toggleModal = () => setModal(!openModal);
  const toggleModalSell = () => setModalSell(!openModalSell);

  const itemsCtx = itemsContext();

  // Callback to select category
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      <Navbar 
        toggleModal={toggleModal} 
        toggleModalSell={toggleModalSell} 
        onCategorySelect={handleCategorySelect} // Pass callback to Navbar
      />
      <Login toggleModal={toggleModal} status={openModal} />
      <Sell setItems={itemsCtx.setItems} toggleModalSell={toggleModalSell} status={openModalSell} />
      <Card items={itemsCtx.items} selectedCategory={selectedCategory} /> 
    </div>
  );
}