// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

// export default clerkMiddleware((auth, request) => {
//   if (isAdminRoute(request)) {
//     const { userId, sessionClaims } = auth();

//     console.log('Session Claims:', sessionClaims);

//     if (!userId) {
//       return NextResponse.redirect(new URL('/sign-in', request.url));
//     }

//     const orgRole = sessionClaims?.orgRole;

//     if (orgRole !== 'org:admin') {
//       return NextResponse.redirect(new URL('/', request.url));
//     }
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: [
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     '/(api|trpc)(.*)',
//   ],
// };

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/dashboard(.*)", "/settings(.*)"]);
const isOnboardingRoute = createRouteMatcher(['/onboarding']);
const isSelectAccountRoute = createRouteMatcher(['/select-account']);

export default clerkMiddleware((auth, req) => {
  const { userId, sessionClaims, orgId, orgSlug } = auth();
  // const url = new URL(req.url);

  console.log('Session Claims:', sessionClaims?.metadata);
  // // Handle users who aren't authenticated
  // if (isProtectedRoute(req)) auth().protect();

   // Redirect unauthenticated users to sign-in for protected routes
  if (!userId && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
  
  // add check if user is not an admin
  if (sessionClaims?.metadata?.role !== 'admin' && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Handle onboarding
  if (userId && isOnboardingRoute(req)) {
    if (sessionClaims?.metadata?.onboardingComplete) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // Redirect to onboarding if not complete
  if (userId && !sessionClaims?.metadata?.onboardingComplete && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }

  // Redirect to select-account if logged in, onboarded, but no org set
  if (userId && sessionClaims?.metadata?.onboardingComplete && !orgId && !isSelectAccountRoute(req)) {
    return NextResponse.redirect(new URL('/select-account', req.url));
  }

  // Allow access to protected routes for authenticated users
  if (userId && isProtectedRoute(req)) {
    return NextResponse.next();
  }

  // Allow users visiting public routes
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};


