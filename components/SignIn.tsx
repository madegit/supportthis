"use client";

import type React from "react";

import { useState, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

function SignInForm({ callbackUrl }: { callbackUrl: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl });
  };

  if (status === "authenticated") {
    return null;
  }

  return (
    <div
      className="min-h-screen h-full bg-black flex flex-col lg:flex-row overflow-auto lg:overflow-hidden"
      style={{ padding: "20px" }}
    >
      {/* Left Side - Branding with Mesh Gradient Background */}
      <div className="w-[90vw] lg:w-[45vw] h-[30vh] lg:h-[90vh] mx-auto flex items-center justify-center order-1 lg:order-1">
        <div
          className="w-full rounded-2xl relative overflow-hidden h-full"
          style={{
            backgroundImage: "url('/mesh-gradient.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8 text-white">
            <div className="mb-6 md:mb-8 flex items-center">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-2">
                <div className="w-3 h-3 bg-purple-600 rounded-full" />
              </div>
              <span className="text-lg font-bold">SupportThis</span>
            </div>

            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-2xl md:text-3xl font-bold mb-3">
                Welcome Back
              </h1>
              <p className="text-gray-200 text-md">
                You're home.
                <br />
                Let’s fund what matters.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex-1 bg-black flex flex-col order-2 lg:order-2 overflow-auto lg:overflow-hidden">
        <div className="flex-1 flex items-center justify-center overflow-auto scrollbar-hide md:scrollbar-default">
          <div className="w-full max-w-md p-6 md:p-12">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                  Sign In
                </h2>
                <p className="text-gray-300 text-sm md:text-base">
                  Enter your credentials to access your account
                </p>
              </div>

              {error && (
                <Alert
                  variant="destructive"
                  className="bg-gray-800 border-gray-700"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-gray-200">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={() => handleOAuthSignIn("google")}
                  variant="outline"
                  className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 h-11 rounded-lg flex items-center justify-center space-x-2"
                  disabled={isLoading}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Google</span>
                </Button>
                <Button
                  onClick={() => handleOAuthSignIn("github")}
                  variant="outline"
                  className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 h-11 rounded-lg flex items-center justify-center space-x-2"
                  disabled={isLoading}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-black px-2 text-gray-300">Or</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 rounded-lg h-11 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-200">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 rounded-lg h-11 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-gray-100 h-11 text-sm font-medium rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-gray-300 text-sm">
                  Don't have an account?{" "}
                  <Link
                    href="/get-started"
                    className="text-white hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignInWithSearchParams() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") ?? "/dashboard";
  return <SignInForm callbackUrl={callbackUrl} />;
}

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
          Loading...
        </div>
      }
    >
      <SignInWithSearchParams />
    </Suspense>
  );
}
