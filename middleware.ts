import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Your custom middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = { 
  matcher: [
    "/dashboard", 
    "/profile", 
    "/settings", 
    "/projects/create",
    "/projects/:path*"  // This will cover all routes under /projects
  ] 
}