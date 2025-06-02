import type React from "react"

const Header: React.FC = () => {
  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto py-4 px-6 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold text-primary">
          My App
        </a>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
