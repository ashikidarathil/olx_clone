import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDN2hFmwNuJZlrO3MyZqcq_7tY1UEok490",
  authDomain: "olx-clone-2c968.firebaseapp.com",
  projectId: "olx-clone-2c968",
  storageBucket: "olx-clone-2c968.firebasestorage.app",
  messagingSenderId: "988001402596",
  appId: "1:988001402596:web:c7e7f7f44772c6f29cf6f1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
const fireStore = getFirestore(app);

const fetchFromFireStore = async () => {
  try {
    const productsCollection = collection(fireStore, 'products');
    const productSnapshot = await getDocs(productsCollection);
    const productList = productSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return productList;
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    return [];
  }
};

export { auth, provider, storage, fireStore, fetchFromFireStore };