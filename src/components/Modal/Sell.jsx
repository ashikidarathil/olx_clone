import { Modal, ModalBody } from "flowbite-react";
import { useState } from "react";
import Input from "../Input/Input";
import { userAuth } from "../Context/Auth";
import { addDoc, collection } from "firebase/firestore";
import { fetchFromFireStore, fireStore } from "../Firebase/Firebase";
import fileUpload from '../../assets/fileUpload.svg';
import loading from '../../assets/loading.gif';
import close from '../../assets/close.svg';

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../Firebase/Firebase";

export default function Sell({ toggleModalSell, status, setItems }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" }); // type: 'error' or 'success'
  const [errors, setErrors] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    image: "",
  });

  const auth = userAuth();

  const handleImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: "Image must be less than 5MB" }));
        return;
      }
      setImage(file);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: "",
      category: "",
      price: "",
      description: "",
      image: "",
    };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }
    if (!category.trim()) {
      newErrors.category = "Category is required";
      isValid = false;
    }
    if (!price.toString().trim()) {
      newErrors.price = "Price is required";
      isValid = false;
    } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      newErrors.price = "Price must be a valid positive number";
      isValid = false;
    }
    if (!description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }
    if (!image) {
      newErrors.image = "Image is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ text: "", type: "" });

    if (!auth?.user) {
      setStatusMessage({ text: "Please login to continue", type: "error" });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    let imageUrl = '';
    try {
      // 1. Upload Image to Firebase Storage
      const storageRef = ref(storage, `products/${Date.now()}_${image.name}`);
      const uploadResult = await uploadBytes(storageRef, image);
      imageUrl = await getDownloadURL(uploadResult.ref);

      // 2. Save Data to Firestore
      await addDoc(collection(fireStore, "products"), {
        title: title.trim(),
        category: category.trim(),
        price: parseFloat(price.toString().trim()),
        imageUrl,
        description: description.trim(),
        userId: auth.user.displayName || "Anonymous",
        createdAt: new Date().toDateString(),
      });

      setStatusMessage({ text: "Product posted successfully!", type: "success" });
      
      // Reset Form
      setTitle("");
      setCategory("");
      setPrice("");
      setDescription("");
      setImage(null);
      setErrors({ title: "", category: "", price: "", description: "", image: "" });

      // Refresh data
      const data = await fetchFromFireStore();
      setItems(data);

      // Close modal after delay
      setTimeout(() => {
        toggleModalSell();
        setStatusMessage({ text: "", type: "" });
      }, 2000);

    } catch (error) {
      console.error("Error creating product:", error);
      setStatusMessage({ 
        text: error.message || "Failed to create product. Please try again.", 
        type: "error" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Modal
        theme={{
          content: {
            base: "relative w-full p-4 md:h-auto",
            inner: "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700",
          },
        }}
        show={status}
        onClose={toggleModalSell}
        position="center"
        size="md"
        popup={true}
      >
        <ModalBody className="bg-white p-0 rounded-md" onClick={(e) => e.stopPropagation()}>
          <img
            src={close}
            alt="Close"
            className="w-6 absolute z-10 top-6 right-8 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => {
              toggleModalSell();
              setImage(null);
              setErrors({ title: "", category: "", price: "", description: "", image: "" });
              setStatusMessage({ text: "", type: "" });
            }}
          />
          <div className="p-6 sm:p-8 max-h-[85dvh] overflow-y-auto">
            <p className="font-bold text-2xl mb-6 text-[#002f34]">Sell Item</p>

            {statusMessage.text && (
              <div className={`p-4 mb-6 rounded-md text-sm font-semibold border ${
                statusMessage.type === 'error' 
                  ? 'bg-red-50 text-red-700 border-red-200' 
                  : 'bg-green-50 text-green-700 border-green-200'
              }`}>
                {statusMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input setInput={setTitle} value={title} placeholder="Title" />
                {errors.title && <p className="text-red-500 text-xs mt-1 ml-1">{errors.title}</p>}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input setInput={setCategory} value={category} placeholder="Category" />
                  {errors.category && <p className="text-red-500 text-xs mt-1 ml-1">{errors.category}</p>}
                </div>
                <div>
                  <Input setInput={setPrice} value={price} placeholder="Price" type="number" />
                  {errors.price && <p className="text-red-500 text-xs mt-1 ml-1">{errors.price}</p>}
                </div>
              </div>

              <div>
                <Input setInput={setDescription} value={description} placeholder="Description" />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.description}</p>
                )}
              </div>

              <div className="pt-4">
                <p className="text-sm font-bold text-[#002f34] mb-2">Upload Image</p>
                {image ? (
                  <div className="group relative h-48 w-full flex justify-center border-2 border-[#002f34] border-dashed rounded-lg overflow-hidden bg-gray-50">
                    <img src={URL.createObjectURL(image)} alt="Preview" className="h-full object-contain" />
                    <button 
                      type="button"
                      onClick={() => setImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <img src={close} alt="Remove" className="w-4 invert" />
                    </button>
                  </div>
                ) : (
                  <div className="relative h-48 w-full border-2 border-gray-300 border-dashed rounded-lg hover:border-[#002f34] transition-colors bg-gray-50 flex flex-col items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      className="absolute inset-0 h-full w-full opacity-0 cursor-pointer z-10"
                    />
                    <img src={fileUpload} alt="Upload" className="w-10 mb-2 opacity-50" />
                    <p className="text-sm text-gray-500">Tap to upload a photo</p>
                    <p className="text-xs text-gray-400 mt-1">Max size: 5MB</p>
                  </div>
                )}
                {errors.image && <p className="text-red-500 text-xs mt-1 ml-1 font-semibold">{errors.image}</p>}
              </div>

              <div className="pt-6">
                {submitting ? (
                  <button
                    disabled
                    className="w-full flex items-center justify-center bg-gray-200 py-3 rounded-lg cursor-not-allowed"
                  >
                    <img className="w-8 h-8 mr-2" src={loading} alt="Loading" />
                    <span className="font-bold text-[#002f34]">Uploading Product...</span>
                  </button>
                ) : (
                  <button
                    className="w-full p-4 rounded-lg text-white font-bold text-lg shadow-lg hover:bg-[#003f45] transition-colors"
                    style={{ backgroundColor: '#002f34' }}
                    type="submit"
                  >
                    Post Now
                  </button>
                )}
              </div>
            </form>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}