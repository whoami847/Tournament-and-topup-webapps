
import { create } from 'zustand';
import { Gateway } from './gateways';

interface StoreState {
  gateways: Gateway[];
  addGateway: (gateway: Omit<Gateway, 'id'>) => Promise<void>;
  updateGateway: (id: string, updates: Partial<Omit<Gateway, 'id' | 'name'>>) => Promise<void>;
  deleteGateway: (id: string) => Promise<void>;
}

const useStoreImpl = create<StoreState>((set, get) => {
  return {
    gateways: [],
    addGateway: async (gateway) => {
      const newGateway: Gateway = {
        ...gateway,
        id: Date.now().toString(), // Simple ID generation
      };
      set((state) => ({
        gateways: [...state.gateways, newGateway],
      }));
    },
    updateGateway: async (id, updates) => {
      set((state) => ({
        gateways: state.gateways.map((gateway) =>
          gateway.id === id ? { ...gateway, ...updates } : gateway
        ),
      }));
    },
    deleteGateway: async (id) => {
      set((state) => ({
        gateways: state.gateways.filter((gateway) => gateway.id !== id),
      }));
    },
  };
});

// A selector-based hook to avoid unnecessary re-renders
export const useStore = <T>(selector: (state: StoreState) => T): T => {
    return useStoreImpl(selector);
};

// Also expose the whole store for convenience, though selectors are preferred
export const store = useStoreImpl;

// Export the hook with the name that components expect
export const useAppStore = useStoreImpl;
