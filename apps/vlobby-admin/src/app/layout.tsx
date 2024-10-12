import '@repo/ui/globals.css';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';
import ConvexClientProvider from './ConvexClientProvider';
import { ReactNode } from 'react';
import { Toaster } from '@repo/ui/components/ui/toaster';

/**
 * Metadata for the application.
 * Defines the title, description, and favicon for the app.
 */
export const metadata = {
  title: 'VLobby | Rethink Property',
  description: 'Developed by the VLobby team to streamline building management',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

/**
 * RootLayout Component
 *
 * This component serves as the main layout wrapper for the entire application.
 * It sets up the HTML structure, applies global styles, and provides theme and state management.
 *
 * @param {Object} props - The component props
 * @param {ReactNode} props.children - The child components to be rendered within the layout
 * @returns {JSX.Element} The rendered root layout
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${GeistSans.variable}`}
    >
      <body className="h-screen w-screen overflow-hidden">
        <div className="h-full w-full bg-background p-4">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ConvexClientProvider>{children}</ConvexClientProvider>
            <Toaster />
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
