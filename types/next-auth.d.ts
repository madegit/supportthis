import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    username?: string;
    avatarImage?: string;
    coverImage?: string;
  }

  interface Session {
    user: User & {
      id: string;
    };
  }
}
