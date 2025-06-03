import { Suspense } from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the signin component
const SignIn = dynamic(() => import("@/components/SignIn"), {
  loading: () => <SignInSkeleton />,
});

export const metadata: Metadata = {
  title: "Sign In | Creator Support Platform",
  description:
    "Sign in to your creator account to manage your projects and supporters.",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen overflow-x-hidden no-horizontal-scroll">
      <Suspense fallback={<SignInSkeleton />}>
        <SignIn />
      </Suspense>
    </div>
  );
}

function SignInSkeleton() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-6 w-full max-w-md mb-10" />
        <div className="space-y-6">
          <Skeleton className="h-12 w-full max-w-md" />
          <Skeleton className="h-12 w-full max-w-md" />
          <Skeleton className="h-12 w-1/2 max-w-[200px]" />
        </div>
      </div>
      <div className="hidden md:block md:w-1/2 bg-gray-100">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
}
