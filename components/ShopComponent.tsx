import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'

const shopItems = [
  { name: 'T-Shirt', price: 25, image: '/t-shirt.jpg?height=360&width=640', rating: 4.3 },
  { name: 'Mug', price: 15, image: '/mug.jpg?height=360&width=640', rating: null },
  { name: 'Sticker Pack', price: 10, image: '/stickerpack.webp?height=360&width=640', rating: 4.7 },
]

export default function ShopComponent() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 tracking-tight">Shop</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Support your favorite creator by purchasing exclusive merchandise.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {shopItems.map((item, index) => (
          <Link href="/product" key={index} className="mb-8 bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm shadow rounded-xl overflow-hidden shadow-sm">
            <div className="">
              <Image 
                src={item.image} 
                alt={item.name} 
                width={400} 
                height={440} 
                className="w-full h-60 object-cover transition-transform group-hover:scale-105"  />
            </div>
            <div className="flex justify-between items-start p-6">
              <div className="w-[60%]">
                <h3 className="font-semibold text-lg mb-1 tracking-tight">{item.name}</h3>
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 fill-black text-black dark:fill-red-500 dark:text-red-500 mr-1" />
                  {item.rating ? (
                    <span>{item.rating.toFixed(1)}</span>
                  ) : (
                    <span>No ratings</span>
                  )}
                </div>
              </div>
              <p className="w-[35%] text-right font-bold tracking-tight text-xl">${item.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}