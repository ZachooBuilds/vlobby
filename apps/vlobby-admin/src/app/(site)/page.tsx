import Link from "next/link";

/**
 * AdminPage Component
 *
 * This component serves as the main landing page for the VLobby application.
 * It provides an overview of the different applications within VLobby and
 * links to access them.
 *
 * The page features:
 * - A centered layout with a title and a grid of application links
 * - Responsive design that adjusts the grid layout based on screen size
 * - Links to the Admin, User, and Resolve applications
 */
export default function AdminPage() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-primary p-4">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        {/* Main title of the page */}
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          VLobby Revamp
        </h1>

        {/* Grid container for application links */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
          {/* Admin Application Link */}
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="/admin/dashboard"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Admin Application →</h3>
            <div className="text-lg">
              Explore the redesigned admin dashboard for VLobby.
            </div>
          </Link>

          {/* User Application Link */}
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="/user"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">User Application →</h3>
            <div className="text-lg">
              Explore the new and improved VLobby user application.
            </div>
          </Link>

          {/* Resolve Application Link */}
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="/resolve"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Resolve Application →</h3>
            <div className="text-lg">
              Explore the new and improved VLobby resolve application a place
              for all external contractors to receive and respond to issues.
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
