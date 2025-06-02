"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";

export default function ComingSoonComponent() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-[url('bg.jpg')] text-gray-800 dark:text-gray-200 flex flex-col">
      <main className="flex-grow container mx-auto px-7 py-15 flex flex-col items-center justify-center relative z-10">
        <Card className="w-full max-w-md bg-white/60 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl mb-4 tracking-tighter">
          <CardHeader className="">
            <CardTitle className="text-4xl font-bold mb-2 flex">
              Cooking the Perfect Digital Recipe.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-600 dark:text-gray-300  mb-6">
              We're building a revolutionary platform to support creators. Be
              the first to know when we launch!
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
