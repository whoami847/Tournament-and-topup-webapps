
import { create } from 'zustand';
import { Gateway } from './gateways';
import { firestore } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  onSnapshot 
} from 'firebase/firestore';

interface StoreState {
  gateways: Gateway[];
  loadGateways: () => Promise<void>;
  addGateway: (gateway: Omit<Gateway, 'id'>) => Promise<void>;
  updateGateway: (id: string, updates: Partial<Omit<Gateway, 'id' | 'name'>>) => Promise<void>;
  deleteGateway: (id: string) => Promise<void>;
}

const gatewaysCollection = collection(firestore, 'gateways');

const useStoreImpl = create<StoreState>((set, get) => {
  return {
    gateways: [],
    
    loadGateways: async () => {
      try {
        const querySnapshot = await getDocs(gatewaysCollection);
        const gateways: Gateway[] = [];
        querySnapshot.forEach((doc) => {
          gateways.push({ id: doc.id, ...doc.data() } as Gateway);
        });
        set({ gateways });
      } catch (error) {
        console.error('Error loading gateways:', error);
      }
    },
    
    addGateway: async (gateway) => {
      try {
        const docRef = await addDoc(gatewaysCollection, gateway);
        const newGateway: Gateway = {
          ...gateway,
          id: docRef.id,
        };
        set((state) => ({
          gateways: [...state.gateways, newGateway],
        }));
      } catch (error) {
        console.error('Error adding gateway:', error);
        throw error;
      }
    },
    
    updateGateway: async (id, updates) => {
      try {
        const gatewayDoc = doc(firestore, 'gateways', id);
        await updateDoc(gatewayDoc, updates);
        set((state) => ({
          gateways: state.gateways.map((gateway) =>
            gateway.id === id ? { ...gateway, ...updates } : gateway
          ),
        }));
      } catch (error) {
        console.error('Error updating gateway:', error);
        throw error;
      }
    },
    
    deleteGateway: async (id) => {
      try {
        const gatewayDoc = doc(firestore, 'gateways', id);
        await deleteDoc(gatewayDoc);
        set((state) => ({
          gateways: state.gateways.filter((gateway) => gateway.id !== id),
        }));
      } catch (error) {
        console.error('Error deleting gateway:', error);
        throw error;
      }
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
