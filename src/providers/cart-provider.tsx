'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

export function CartProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Rehydrate the cart store on the client side
    useCartStore.persist.rehydrate();
  }, []);

  return <>{children}</>;
}