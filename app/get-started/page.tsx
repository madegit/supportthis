import { Suspense } from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the signup component
const NewSignupFlow = dynamic(() => import("@/components/new-signup-flow"), {
  loading: () => <SignupSkeleton />,
});

export const metadata: Metadata = {
  title: "Get Started | Creator Support Platform",
  description:
    "Join our platform and start receiving support for your creative projects.",
};

export default function GetStartedPage() {
  return (
    <div className="min-h-screen overflow-x-hidden no-horizontal-scroll">
      <Suspense fallback={<SignupSkeleton />}>
        <NewSignupFlow />
      </Suspense>
    </div>
  );
}

function SignupSkeleton() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-6 w-full max-w-md mb-10" />
        <div className="space-y-6">
          <Skeleton className="h-12 w-full max-w-md" />
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
