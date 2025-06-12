import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartItem {
  id: string;
  productType: string;
  coverSKU: string;
  coverVariantId: string;
  coverPrice: number;
  snapStraps: boolean;
  handles: boolean;
  magnets: boolean;
  selectedColor: string;
  isPremiumColor: boolean;
  premiumColorCharge: number;
  quantity: number;
  total: number;
}

interface CartStore {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (item) => {
        const id = Date.now().toString();
        set((state) => ({
          items: [...state.items, { ...item, id }]
        }));
      },
      
      removeFromCart: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id)
        }));
      },
      
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.total, 0);
      }
    }),
    {
      name: 'castaway-covers-cart',
      storage: createJSONStorage(() => localStorage)
    }
  )
);