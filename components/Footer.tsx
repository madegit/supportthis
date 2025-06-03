import DarkModeToggle from "./dark-mode-switch";
export function Footer() {
  return (
    <footer className="bg-black text-white dark:text-gray-200 py-8">
      <div className="container mx-auto px-4 text-center">
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
        <p className="text-sm mt-2 text-gray-600 tracking-tight">
          Copyright © 2024 -{" "}
          <a
            href="https://supportthis.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            SupportThis.org
          </a>
        </p>
      </div>
    </footer>
  );
}
