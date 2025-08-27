"use client";

import { createContext, useContext, useState } from "react";
import CartModal, { CartItem } from "@/components/cart/cart-modal";

type CartContextType = {
  items: CartItem[];
  open: boolean;
  setOpen: (v: boolean) => void;
  addItem: (item: CartItem) => void;
  inc: (id: string, size?: string) => void;
  dec: (id: string, size?: string) => void;
  remove: (id: string, size?: string) => void;
  changeSize: (id: string, oldSize: string, newSize: string) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const match = prev.find(it => it.id === item.id && it.size === item.size);
      if (match) {
        return prev.map(it => it === match ? { ...it, qty: it.qty + item.qty } : it);
      }
      return [...prev, item];
    });
    setOpen(true);
  };

const inc = (id: string, size?: string) =>
  setItems(prev => prev.map(it => (it.id === id && it.size === size ? { ...it, qty: it.qty + 1 } : it)));

const dec = (id: string, size?: string) =>
  setItems(prev =>
    prev.flatMap(it =>
      it.id !== id || it.size !== size ? [it] : it.qty - 1 <= 0 ? [] : [{ ...it, qty: it.qty - 1 }]
    )
  );

const remove = (id: string, size?: string) =>
  setItems(prev => prev.filter(it => !(it.id === id && it.size === size)));

  const changeSize = (id: string, oldSize: string, newSize: string) =>
    setItems(prev =>
      prev.map(it => (it.id === id && it.size === oldSize ? { ...it, size: newSize } : it))
    );

  return (
    <CartContext.Provider value={{ items, open, setOpen, addItem, inc, dec, remove, changeSize }}>
      {children}
 <CartModal
  open={open}
  onClose={() => setOpen(false)}
  items={items}
  onInc={inc}
  onDec={dec}
  onRemove={remove}
  onChangeSize={changeSize}
/>


    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
