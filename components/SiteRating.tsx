import { Star } from "lucide-react"

export default function SiteRating() {
  return (
    <>
      <div className="flex justify-center items-center space-x-1 mb-4">
        <Star className="h-5 w-5 text-yellow-400 fill-current" />
        <Star className="h-5 w-5 text-yellow-400 fill-current" />
        <Star className="h-5 w-5 text-yellow-400 fill-current" />
        <Star className="h-5 w-5 text-yellow-400 fill-current" />
        <Star className="h-5 w-5 text-gray-300 dark:text-gray-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-300 tracking-tight">4.0 out of 5</span>
      </div>
      <div className="text-center mb-16">
        <p className="text-xl font-semibold tracking-tight">Creators love us.</p>
      </div>
    </>
  )
}