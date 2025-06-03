import DarkModeToggle from "./dark-mode-switch";
import { LockIcon, Heart } from "lucide-react";
export function SupportFooter() {
  return (
    <footer className="bg-black dark:bg-[#121212] text-white dark:text-gray-200 py-8">
      <div className="container mx-auto px-4 text-center">
        <p>
          {" "}
          <LockIcon className="h-4 w-4" />
          <a
            href="https://supportthis.org/get-started"
            target="_blank"
            rel="noopener noreferrer"
          >
            SupportThis.org
          </a>
          keeps transactions secure and creators in control.
        </p>
        <div className="w-full flex justify-center mb-3">
          <DarkModeToggle />
        </div>
      </div>
    </footer>
  );
}
