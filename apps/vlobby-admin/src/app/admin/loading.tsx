import { Loader2 } from "lucide-react";

/**
 * Loading component
 * 
 * This component displays a loading spinner and text.
 * It's typically used as a fallback UI while content is being loaded.
 * 
 * @returns {JSX Component} A div containing a spinning loader icon and "Loading..." text
 */
export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <span className="ml-10 text-sm font-medium">Loading...</span>
    </div>
  );
}
