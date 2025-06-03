import React, { forwardRef } from 'react';
import { LockIcon } from "lucide-react";
export function SupportFooter({ref}: {ref: any}) {
 return (
    <footer className="bg-red-50 dark:bg-black text-gray-700 dark:text-red-50 py-8">
      <div className="container mx-auto px-4 text-center">
        <p>
          {" "}
          <LockIcon className="h-4 w-4 inline mr-1" />
         All transactions secured and creators in control.
        </p>
      
      </div>
    </footer>
  );
}
