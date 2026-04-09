import { collection, getDocs } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { fireStore } from "../Firebase/Firebase";

const Context = createContext(null);
export const itemsContext = () => useContext(Context);

export default function ItemContextProvider({ children }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItemFromFirestore = async () => {
      try {
        setLoading(true);
        const productsCollection = collection(fireStore, 'products');
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(productList);
        setError(null);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchItemFromFirestore();
  }, []);

  return (
    <Context.Provider value={{ items, setItems, error, loading }}>
      {children}
    </Context.Provider>
  );
}