import DarkModeToggle from './dark-mode-switch'

export function ProfileFooter() {
  return (
    <footer className="bg-black dark:bg-gray-800 text-white dark:text-gray-200 mt-8 py-8">
      <div className="col-span-full mt-8">
        <div className="w-full flex justify-center mb-3">
          <DarkModeToggle />
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <a href="#" className="hover:underline tracking-tight">
            Help Center
          </a>
          <a href="#" className="hover:underline tracking-tight">
            FAQ
          </a>
          <a href="#" className="hover:underline tracking-tight">
            Contact
          </a>
          <a href="#" className="hover:underline tracking-tight">
            Refer a Creator
          </a>
        </div>
      </div>
    </footer>
  )
}