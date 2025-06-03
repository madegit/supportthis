import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTASection() {
  return (
    <Card className="mb-8 bg-white dark:bg-[#121212] bg-opacity-50 backdrop-blur-sm shadow rounded-xl">
      <CardContent className="p-6 text-center">
        <h3 className="text-2xl font-bold mb-2 tracking-tight">
          Let your audience show love with one-time tips.
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 tracking-tight">
          Join 9k+ creators getting hearts!
        </p>
        <Button className="bg-black dark:bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-400 text-base py-2 px-6 rounded-xl">
          <Link href="/get-started/">Get Started</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
