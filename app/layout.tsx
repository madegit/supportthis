import type React from "react";
import "@/app/globals.css";
import { Figtree } from "next/font/google";
import { Providers } from "./providers";
import { ThemeProvider } from "next-themes";
import { EdgeStoreProvider } from "../lib/edgestore";

const figtree = Figtree({ subsets: ["latin"] });

export const metadata = {
  title: "SupportThis.org",
  description: "A platform for supporting your favorite creators",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={figtree.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {" "}
          <EdgeStoreProvider>
            <Providers>{children}</Providers>{" "}
          </EdgeStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
