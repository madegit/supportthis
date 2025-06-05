"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Check, X } from "lucide-react";
import OnboardingProfileSetup from "@/components/onboarding-profile-setup";

// Custom scrollbar hiding utility
const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
  .scrollbar-default {
    -ms-overflow-style: auto;
    scrollbar-width: auto;
  }
  .scrollbar-default::-webkit-scrollbar {
    display: block;
  }
`;

interface SignupFlowProps {
  onComplete?: () => void;
}

export default function NewSignupFlow({ onComplete }: SignupFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null,
  );
  const [usernameError, setUsernameError] = useState("");

  // Step 2 form data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const steps = [
    {
      number: 1,
      title: "Choose Username",
      active: currentStep === 1,
      completed: currentStep > 1,
    },
    {
      number: 2,
      title: "Create Account",
      active: currentStep === 2,
      completed: currentStep > 2,
    },
    {
      number: 3,
      title: "Set up Profile",
      active: currentStep === 3,
      completed: currentStep > 3,
    },
  ];

  // Username validation and checking
  useEffect(() => {
    const checkUsername = async () => {
      if (username.length < 3) {
        setUsernameAvailable(null);
        setUsernameError("");
        return;
      }

      if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        setUsernameAvailable(false);
        setUsernameError(
          "Username can only contain letters, numbers, and underscores (3-20 characters)",
        );
        return;
      }

      setIsCheckingUsername(true);
      try {
        const response = await fetch(
          `/api/check-username?username=${username}`,
        );
        const data = await response.json();
        setUsernameAvailable(data.available);
        setUsernameError(data.available ? "" : "Username is already taken");
      } catch (error) {
        setUsernameError("Error checking username availability");
      }
      setIsCheckingUsername(false);
    };

    const debounceTimer = setTimeout(checkUsername, 500);
    return () => clearTimeout(debounceTimer);
  }, [username]);

  const handleUsernameNext = () => {
    if (usernameAvailable && username.length >= 3) {
      setCurrentStep(2);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert({ type: "", message: "" });

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          password,
          username,
        }),
      });

      if (response.ok) {
        setAlert({
          type: "success",
          message: "Account created successfully! Setting up your profile...",
        });

        // Sign in the user
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (result?.error) {
          setAlert({ type: "error", message: result.error });
        } else {
          setTimeout(() => setCurrentStep(3), 1000);
        }
      } else {
        const data = await response.json();
        setAlert({
          type: "error",
          message: data.message || "An error occurred during sign up",
        });
      }
    } catch (error) {
      setAlert({ type: "error", message: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: string) => {
    setIsLoading(true);
    try {
      const result = await signIn(provider, {
        callbackUrl: "/dashboard",
        redirect: false,
      });
      if (result?.error) {
        setAlert({ type: "error", message: result.error });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "An error occurred during OAuth sign up",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                Choose Your Username
              </h2>
              <p className="text-gray-300 text-sm md:text-base">
                This will be your unique identifier on SupportThis
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-200">
                  Username
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    placeholder="e.g. johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    className="bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 rounded-lg h-11 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  />
                  {username.length >= 3 && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isCheckingUsername ? (
                        <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full" />
                      ) : usernameAvailable ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {usernameError && (
                  <p className="text-red-400 text-sm">{usernameError}</p>
                )}
                {usernameAvailable && username.length >= 3 && (
                  <p className="text-green-400 text-sm">
                    ✓ Username is available!
                  </p>
                )}
              </div>

              <Button
                onClick={handleUsernameNext}
                disabled={!usernameAvailable || username.length < 3}
                className="w-full bg-white text-black hover:bg-gray-100 h-11 text-sm font-medium rounded-lg transition-colors"
              >
                Continue
              </Button>

              <div className="text-center">
                <p className="text-gray-300 text-sm">
                  Already have an account?{" "}
                  <Link href="/signin" className="text-white hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                Create Account
              </h2>
              <p className="text-gray-300 text-sm md:text-base">
                Enter your personal data to create your account.
              </p>
            </div>

            {alert.type && (
              <Alert
                variant={alert.type === "error" ? "destructive" : "default"}
                className="bg-gray-800 border-gray-700"
              >
                {alert.type === "error" ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                <AlertDescription className="text-gray-200">
                  {alert.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={() => handleOAuthSignUp("google")}
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
                onClick={() => handleOAuthSignUp("github")}
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

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-200">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="e.g. John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 rounded-lg h-11 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-200">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="e.g. Francisco"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 rounded-lg h-11 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. johnfrans@gmail.com"
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
                <p className="text-gray-400 text-xs">
                  Must be at least 8 characters.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-gray-100 h-11 text-sm font-medium rounded-lg transition-colors"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-gray-300 text-sm">
                Already have an account?{" "}
                <Link href="/signin" className="text-white hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="h-full">
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                Set up your profile
              </h2>
              <p className="text-gray-300 text-sm md:text-base">
                Complete your profile to get started
              </p>
            </div>
            <div className="flex-1 overflow-auto">
              <OnboardingProfileSetup onComplete={onComplete} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen h-full bg-black flex flex-col lg:flex-row overflow-auto lg:overflow-hidden overflow-x-hidden"
    >
      <style jsx global>
        {scrollbarHideStyles}
      </style>
      {/* Left Side - Steps with Mesh Gradient Background */}
      <div className="w-full lg:w-[45vw] h-[60vh] lg:h-[100vh] mx-auto flex items-center justify-center order-1 lg:order-1">
        <div
          className="w-full relative overflow-hidden h-full"
          style={{
            backgroundImage: "url('/mesh-gradient.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Keep existing content inside this div unchanged */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8 text-white">
            <div className="mb-6 md:mb-8 flex items-center">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-2">
                <div className="w-3 h-3 bg-purple-600 rounded-full" />
              </div>
              <span className="text-lg font-bold">SupportThis</span>
            </div>

            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-2xl md:text-3xl font-bold mb-3">
                Get Started with Us
              </h1>
              <p className="text-gray-200 text-sm">
                Complete these easy steps to register
                <br />
                your account.
              </p>
            </div>

            <div className="w-full max-w-xs space-y-3">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`flex items-center p-3 rounded-lg ${
                    step.active
                      ? "bg-white text-black"
                      : "bg-black/20 text-white backdrop-blur-sm"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs font-bold ${
                      step.completed
                        ? "bg-green-500 text-white"
                        : step.active
                          ? "bg-black text-white"
                          : "bg-white/20 text-white"
                    }`}
                  >
                    {step.completed ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 bg-black flex flex-col order-2 lg:order-2 overflow-auto lg:overflow-hidden">
        <div className="flex-1 flex items-center justify-center overflow-auto scrollbar-hide md:scrollbar-default">
          <div className="w-full max-w-md p-6 md:p-12">
            {renderStepContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
