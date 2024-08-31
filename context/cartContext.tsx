import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { Product } from "types/product";
import { Cart, CartItem } from "types/cart";

import { useAuth } from "./authContext";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateCartItem: (productId: number, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  cart: null,
  loading: false,
  addToCart: async () => {},
  removeFromCart: async (productId: number) => {
    /* no-op */
  },
  updateCartItem: async () => {},
  // processPayment: async () => {
  //   /* no-op */
  // },
});

export function useCart() {
  return useContext(CartContext);
}

export const CartProvider = ({ children }: any) => {
  const [cart, setCart] = useState<Cart | null>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth()!;

  const getToken = () => localStorage.getItem("access");
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      const token = getToken();
      if (!token || !user || user.role !== "CONSUMER") {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}cart/detail/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCart({
          items: response.data,
          totalItems: response.data.reduce(
            (acc: any, item: any) => acc + item.quantity,
            0
          ),
          totalPrice: response.data
            .reduce(
              (acc: any, item: any) =>
                acc + item.quantity * parseFloat(item.product.price),
              0
            )
            .toFixed(2),
        });
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  // const processPayment = async () => {
  //   setLoading(true);
  //   const token = getToken();

  //   try {
  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}payment/checkout/`,
  //       { cart },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     const approvalUrl = response.data.approval_url;

  //     window.location.href = approvalUrl;
  //   } catch (error) {
  //     console.error("Failed to process payment:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const updateCartItem = async (cartItemId: number, quantity: number) => {
    setLoading(true);
    const token = getToken();
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}cart/update/${cartItemId}/`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCart((currentCart) => {
        if (!currentCart) return null;

        const updatedItems = currentCart.items.map((item) => {
          if (item.id === cartItemId) {
            return { ...item, quantity };
          }
          return item;
        });

        const updatedTotalItems = updatedItems.reduce(
          (acc, item) => acc + item.quantity,
          0
        );
        console.log(updatedTotalItems);
        const updatedTotalPrice = updatedItems.reduce(
          (acc, item) => acc + item.quantity * item.product.price,
          0
        );

        return {
          ...currentCart,
          items: updatedItems,
          totalItems: updatedTotalItems,
          totalPrice: updatedTotalPrice,
        };
      });
    } catch (error) {
      console.error("Failed to update cart item:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    setLoading(true);
    const token = getToken();
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}cart/remove/${productId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCart((currentCart) => {
        if (!currentCart) return null;

        const updatedItems = currentCart.items.filter(
          (item) => item.id !== productId
        );

        const updatedTotalItems = updatedItems.reduce(
          (acc, item) => acc + item.quantity,
          0
        );
        const updatedTotalPrice = updatedItems.reduce(
          (acc, item) => acc + item.quantity * item.product.price,
          0
        );

        return {
          ...currentCart,
          items: updatedItems,
          totalItems: updatedTotalItems,
          totalPrice: updatedTotalPrice,
        };
      });
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    } finally {
      setLoading(false);
    }
  };
  const addToCart = async (product: Product, quantity: number) => {
    setLoading(true);
    const token = getToken();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}cart/add/`,
        {
          product_id: product.id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const addedCartItem = response.data;
      console.log(addedCartItem);
      setCart((currentCart) => {
        if (!currentCart) {
          return {
            items: [{ ...addedCartItem, product, quantity }],
            totalItems: quantity,
            totalPrice: parseFloat((product.price * quantity).toFixed(2)),
          };
        } else {
          const existingItemIndex = currentCart.items.findIndex(
            (item) => item.product.id === product.id
          );

          let updatedItems = [...currentCart.items];
          if (existingItemIndex !== -1) {
            const existingItem = updatedItems[existingItemIndex];
            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantity: existingItem.quantity + quantity,
            };
          } else {
            updatedItems.push({ ...addedCartItem, product, quantity });
          }

          const updatedTotalItems = updatedItems.reduce(
            (acc, item) => acc + item.quantity,
            0
          );
          const updatedTotalPrice = updatedItems.reduce(
            (acc, item) => acc + item.quantity * item.product.price,
            0
          );

          return {
            items: updatedItems,
            totalItems: updatedTotalItems,
            totalPrice: parseFloat(updatedTotalPrice.toFixed(2)),
          };
        }
      });
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateCartItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
