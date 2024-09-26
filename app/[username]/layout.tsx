// app/[username]/layout.tsx
import { ReactNode } from 'react';
import { trackPageView } from '@/lib/analytics';
import { Toaster } from "@/components/ui/toaster"

export default async function UsernameLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { username: string };
}) {
  const { username } = params;
  const pathname = `/[username]${params.username}`;

  // Track the page view
  await trackPageView(username, pathname);

  return <>{children}  <Toaster /></>;
}