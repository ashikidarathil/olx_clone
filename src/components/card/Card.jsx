import { Link } from "react-router-dom"
import Favorite from '../../assets/favorite.svg'

export default function Card({ items ,selectedCategory}) {

  const filteredItems = selectedCategory 
    ? items.filter(item => item.category === selectedCategory) 
    : items;

  return (
    <div className='p-10 px-5 sm:px-15 md:px-30 lg:px-40 min-h-screen' >

      <h1 style={{ color: '#002f34' }} className="text-2xl">Fresh recommendations</h1>

      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-5' >
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <h2 className="text-xl text-gray-500 font-medium">No recommendations found.</h2>
            <p className="text-gray-400 mt-2">Try checking back later or explore other categories.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <Link 
              to={'/details'} 
              state={{ item }} 
              key={item.id} 
              className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:scale-[1.01] transition-all duration-300 cursor-pointer"
            >
              <div className="relative">
                {/* Image Section */}
                <div className="w-full h-48 bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
                  <img
                    className="h-full w-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                    src={item.imageUrl || 'https://via.placeholder.com/150'} 
                    alt={item.title} 
                  />
                </div>
                
                {/* Favorite Icon */}
                <div className="absolute top-3 right-3 w-9 h-9 flex justify-center items-center bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors z-10">
                  <img className="w-5" src={Favorite} alt="Favorite" />
                </div>
              </div>

              {/* Details Section */}
              <div className="p-4 bg-white">
                <h1 className="font-bold text-xl text-[#002f34] mb-1">
                  ₹ {new Intl.NumberFormat('en-IN').format(item.price)}
                </h1>
                <p className="text-gray-600 text-sm truncate mb-1">
                  {item.category}
                </p>
                <p className="text-gray-900 font-medium truncate mb-4">
                  {item.title}
                </p>
                
                <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                  <span className="truncate max-w-[100px]">{item.location || 'India'}</span>
                  <span>{item.createdAt || 'Just now'}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

    </div>
  )
}