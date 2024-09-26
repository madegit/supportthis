"use client";

export default function Error() {
  return (
    <div className="grid h-screen px-4 bg-red-50 place-content-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 bg-opacity-50 py-6 px-12 text-center backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl">
        <h1 className="font-black text-gray-200 text-9xl">401</h1>

        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Unauthroized!
        </p>

        <p className="mt-4 text-gray-500">
          You must be logged in to access the page
        </p>

        <button
          type="button"
          className="inline-block px-10 py-3 mt-6 text-sm font-medium text-white bg-gray-800 rounded-xl hover:bg-red-500 focus:outline-none focus:ring"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
