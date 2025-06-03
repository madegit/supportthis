import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getUserByUsername } from "@/lib/api";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { trackPageView } from "@/lib/analytics";

const SupportThisCreator = dynamic(
  () => import("@/components/support-this-creator"),
  {
    loading: () => <UserProfileSkeleton />,
  },
);

async function UserProfileWrapper({ username }: { username: string }) {
  const user = await getUserByUsername(username);

  if (!user) {
    notFound();
  }

  // Track the page view
  await trackPageView(username, `/[username]`);

  return <SupportThisCreator user={user} />;
}

export default function UserPage({ params }: { params: { username: string } }) {
  return (
    <Suspense fallback={<UserProfileSkeleton />}>
      <UserProfileWrapper username={params.username} />
    </Suspense>
  );
}

function UserProfileSkeleton() {
  return (
    <div className="min-h-screen bg-red-50 dark:bg-black py-8 px-4 overflow-x-hidden">
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#121212] rounded-xl overflow-hidden border dark:border-gray-800">
        <Skeleton className="h-48 w-full" />
        <div className="p-6">
          <Skeleton className="h-32 w-32 rounded-full mb-4" />
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/4 mb-4" />
          <Skeleton className="h-20 w-full mb-4" />
          <div className="flex space-x-4 mb-8">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-6" />
          </div>
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  const user = await getUserByUsername(params.username);

  if (!user) {
    return {
      title: "User Not Found",
      description: "The requested user profile could not be found.",
    };
  }

  return {
    title: `${user.name}'s Profile`,
    description:
      user.bio || `Check out ${user.name}'s profile and featured project.`,
  };
}
