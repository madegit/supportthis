"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function ComingSoonComponent() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setEmail("");
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div
      className="min-h-screen bg-[url('bg.jpg')] text-gray-800 dark:text-gray-200 flex flex-col font-['Inter',sans-serif]"
      style={{ letterSpacing: "-0.05em" }}
    >
      <main className="flex-grow container mx-auto px-7 py-15 flex flex-col items-center justify-center relative z-10">
        <Card className="w-full max-w-md bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold mb-4 flex items-center tracking-tight justify-center mr-8">
              Cooking the Perfect Digital Recipe.
            </CardTitle>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              We're building a revolutionary platform to support creators. Be
              the first to know when we launch!
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow bg-gray-50 rounded-xl"
                  required
                />
                <Button
                  type="submit"
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-400 rounded-xl"
                >
                  <Mail className="mr-2 h-4 w-4" /> Join Waitlist
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-black dark:bg-gray-800 text-white dark:text-gray-200 py-8 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p>
            {" "}
            &copy; Copyright 2024{" "}
            <a
              href="https://supportthis.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              SupportThis.org
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
