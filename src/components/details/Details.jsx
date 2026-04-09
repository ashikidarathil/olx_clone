import { useLocation, Link } from "react-router-dom";
import { itemsContext } from "../context/Item";
import Navbar from "../Navbar/Navbar"
import Sell from "../modal/Sell";
import Login from "../modal/login";
import { useState } from "react";
import arrow from "../../assets/arrow-down.svg"; 

export default function Details() {
  const location = useLocation();
  const { item } = location.state || {};

  const [openModal, setModal] = useState(false);
  const [openModalSell, setModalSell] = useState(false);

  const itemsCtx = itemsContext();

  const toggleModal = () => setModal(!openModal);
  const toggleModalSell = () => setModalSell(!openModalSell);

  if (!item) {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-xl font-semibold text-gray-600">No item data available</p>
        <Link to="/" className="text-teal-600 font-bold hover:underline">Go back Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleModalSell={toggleModalSell} toggleModal={toggleModal} />
      <Login toggleModal={toggleModal} status={openModal} />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pt-24 sm:pt-28">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 mb-6 text-[#002f34] font-bold hover:bg-gray-200 p-2 rounded-md transition-colors">
          <img src={arrow} alt="back" className="w-5 rotate-90" />
          <span>Back to Home</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Image & Description */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm flex justify-center items-center bg-gray-100 min-h-[400px] sm:min-h-[500px]">
              <img
                className="max-h-[500px] w-full object-contain"
                src={item.imageUrl || 'https://via.placeholder.com/150'}
                alt={item.title}
              />
            </div>
            
            <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-[#002f34] mb-4 border-b pb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {item?.description}
              </p>
            </div>
          </div>

          {/* Right Column: Actions & Details */}
          <div className="space-y-4">
            {/* Price & Title Card */}
            <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-[#002f34]">₹ {new Intl.NumberFormat('en-IN').format(item.price)}</h1>
                <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors border border-gray-100">
                   {/* Share Icon Placeholder */}
                   <svg className="w-6 h-6 text-[#002f34]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                </div>
              </div>
              <p className="text-xl text-gray-600 mb-6">{item.title}</p>
              <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t">
                <span>{item.location || 'India'}</span>
                <span>{item.createdAt}</span>
              </div>
            </div>

            {/* Seller Card */}
            <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
              <h3 className="text-xl font-bold text-[#002f34] mb-4">Seller Description</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-[#002f34] font-bold text-xl">
                  {item.userId?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-bold text-lg text-[#002f34]">{item.userId || 'User'}</p>
                  <p className="text-sm text-gray-500">Member since Aug 2025</p>
                </div>
              </div>
              <button className="w-full border-2 border-[#002f34] text-[#002f34] font-bold py-3 rounded hover:bg-[#002f34] hover:text-white transition-all mb-3 text-lg">
                Chat with seller
              </button>
            </div>

            {/* Safety Card */}
            <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
               <h3 className="text-lg font-bold text-[#002f34] mb-3">Posted in</h3>
               <p className="text-gray-600 mb-4">{item.location || 'India'}</p>
               <div className="bg-gray-100 p-4 rounded-md">
                 <p className="font-bold text-[#002f34] mb-1">Safety Tips for Buyers</p>
                 <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
                   <li>Meet seller in a public place</li>
                   <li>Check the item before you buy</li>
                   <li>Pay only after collecting the item</li>
                 </ul>
               </div>
            </div>
          </div>

        </div>
      </div>

      <Sell setItems={itemsCtx.setItems} toggleModalSell={toggleModalSell} status={openModalSell} />
    </div>
  );
}