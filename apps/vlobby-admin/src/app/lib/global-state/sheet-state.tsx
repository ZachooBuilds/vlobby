
import { type ReactNode } from "react";
import { create } from "zustand";

/**
 * SheetState Interface
 * 
 * Defines the structure and methods for managing the sheet state.
 */
interface SheetState {
  isOpen: boolean;
  title: string;
  description: string;
  formComponent: ReactNode | null;
  openSheet: (
    title: string,
    description: string,
    formComponent?: ReactNode,
  ) => void;
  closeSheet: () => void;
}

/**
 * useSheetStore Hook
 * 
 * Creates a Zustand store for managing the global sheet state.
 * This store provides methods to open and close the sheet, as well as
 * store its content (title, description, and form component).
 */
export const useSheetStore = create<SheetState>((set) => ({
  isOpen: false,
  title: "",
  description: "",
  formComponent: null,
  /**
   * openSheet Function
   * 
   * Opens the sheet with the provided title, description, and optional form component.
   * 
   * @param {string} title - The title of the sheet
   * @param {string} description - The description or content of the sheet
   * @param {ReactNode} [formComponent] - Optional form component to be rendered in the sheet
   */
  openSheet: (title, description, formComponent) =>
    set({ isOpen: true, title, description, formComponent }),
  /**
   * closeSheet Function
   * 
   * Closes the sheet and resets its content to default values.
   */
  closeSheet: () =>
    set({ isOpen: false, title: "", description: "", formComponent: null }),
}));

export default useSheetStore;
