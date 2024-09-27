import { SignUp } from "@clerk/nextjs";

/**
 * Sign Up Page Component
 * 
 * This component renders the sign-up page for the application.
 * It utilizes Clerk's SignUp component for handling user registration.
 *
 * @returns {JSX.Element} The rendered sign-up page
 */
export default function Page() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      {/**
       * SignUp component from Clerk
       * Handles the entire sign-up process including UI and authentication logic
       * The 'path' prop specifies the route for the sign-up page
       */}
      <SignUp path="/sign-up" />
    </div>
  );
}
