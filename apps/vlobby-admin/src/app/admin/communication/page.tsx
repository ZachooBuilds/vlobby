import { ChatWindow } from "./_components/chat-layout";

/**
 * CommunicationPage Component
 *
 * This component represents the main communication page in the admin section.
 * It fetches all occupants (customers) and chat summaries from the database,
 * then renders the ChatWindow component with this data.
 *
 * The page provides a full-height, scrollable container for the chat interface,
 * allowing admins to view and interact with customer conversations.
 */
export default async function CommunicationPage() {
  return (
    // Main container for the communication page
    <div className="flex h-full flex-col items-start justify-start gap-2">
      {/* Container for the ChatWindow component */}
      <div className="flex h-full w-full flex-col items-start justify-start overflow-scroll rounded-lg bg-background p-4">
        {/* Render the ChatWindow component with fetched data */}
        <ChatWindow />
      </div>
    </div>
  );
}
