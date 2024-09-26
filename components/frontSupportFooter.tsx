import DarkModeToggle from './dark-mode-switch'
import React, { forwardRef } from 'react';

export function SupportFooter({ref}: {ref: any}) {
  return (   
    <footer  ref={ref} className="bg-black dark:bg-gray-800 text-white dark:text-gray-200 py-8">      <div className="container mx-auto px-4 text-center">
        <div className="w-full flex justify-center mb-3">
          <DarkModeToggle />
        </div>
        <p >Powered by <a href="https://supportthis.org/" target="_blank" rel="noopener noreferrer">SupportThis.org</a></p>
      </div>
    </footer>
  )
}