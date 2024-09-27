import { type ReactNode } from "react";
import { create } from "zustand";

/**
 * ModalState Interface
 * 
 * Defines the structure and methods for managing the modal state.
 */
interface ModalState {
  isOpen: boolean;
  title: string;
  description: string;
  formComponent: ReactNode | null;
  openModal: (
    title: string,
    description: string,
    formComponent?: ReactNode,
  ) => void;
  closeModal: () => void;
}

/**
 * useModalStore Hook
 * 
 * Creates a Zustand store for managing the global modal state.
 * This store provides methods to open and close the modal, as well as
 * store its content (title, description, and form component).
 */
export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  title: "",
  description: "",
  formComponent: null,
  /**
   * openModal Function
   * 
   * Opens the modal with the provided title, description, and optional form component.
   * 
   * @param {string} title - The title of the modal
   * @param {string} description - The description or content of the modal
   * @param {ReactNode} [formComponent] - Optional form component to be rendered in the modal
   */
  openModal: (title, description, formComponent) =>
    set({ isOpen: true, title, description, formComponent }),
  /**
   * closeModal Function
   * 
   * Closes the modal and resets its content to default values.
   */
  closeModal: () =>
    set({ isOpen: false, title: "", description: "", formComponent: null }),
}));

export default useModalStore;
