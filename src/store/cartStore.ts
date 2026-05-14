import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartItem {
  id: string;
  productType: string;
  coverSKU: string;
  coverVariantId: string;
  coverPrice: number;
  yards: number;
  angle?: number;
  measurements?: {
    width: number;
    length: number;
    height: number;
    backrestDepth?: number;
    armrestHeight?: number;
    backWidth?: number;
  };
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
  updateItem: (id: string, item: Omit<CartItem, 'id'>) => void;
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
        // Fire Meta Pixel AddToCart event for ad-campaign optimization.
        // This is a high-intent signal Meta can optimize toward.
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'AddToCart', {
            content_name: item.productType,
            content_category: item.productType,
            content_type: 'product',
            value: item.total,
            currency: 'USD',
            num_items: item.quantity,
          });
        }
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
      
      updateItem: (id, updatedItem) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...updatedItem, id } : item
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
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        // Return a dummy storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {}
        };
      }),
      skipHydration: true
    }
  )
);