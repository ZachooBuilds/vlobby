"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@repo/ui/components/ui/dialog";
import useModalStore from "../../../lib/global-state/modal-state";
import { CardDescription } from "@repo/ui/components/ui/card";

/**
 * GlobalModal Component
 * 
 * This component provides a reusable modal dialog for the application.
 * It uses the useModalStore hook to manage the modal's state and content.
 *
 * @returns {JSX.Element} A modal dialog with dynamic content
 */
export function GlobalModal() {
  // Destructure the necessary state and functions from the modal store
  const { isOpen, formComponent, closeModal, title, description } =
    useModalStore();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          {/* Display the modal title */}
          <DialogTitle>{title}</DialogTitle>
          {/* Display the modal description */}
          <CardDescription>{description}</CardDescription>
        </DialogHeader>
        {/* Render the dynamic form component */}
        {formComponent}
      </DialogContent>
    </Dialog>
  );
}
