import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  cartOpen: boolean;
  toggleSidebar: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: false,
  cartOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleCart: () => set((s) => ({ cartOpen: !s.cartOpen })),
  setCartOpen: (open) => set({ cartOpen: open }),
}));
