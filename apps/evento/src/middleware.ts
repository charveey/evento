import { clerkMiddleware } from "@clerk/nextjs/server";

// Make everything public — no auth required
export default clerkMiddleware(() => {});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};