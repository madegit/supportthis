"use client"

import NewSignupFlow from "@/components/new-signup-flow"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()

  const handleSignupComplete = () => {
    router.push("/dashboard")
  }

  return <NewSignupFlow onComplete={handleSignupComplete} />
}
