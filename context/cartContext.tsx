import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { Product } from "@/types/product";
import { Cart, CartItem } from "@/types/cart";
import { useAuth } from "./authContext";
import { API_BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  addToCart: async () => { },
  removeFromCart: async () => { },
  updateCartItem: async () => { },
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

  const getToken = async () => {
    return await AsyncStorage.getItem("access");
  };

  useEffect(() => {
    if (user && user.role === "CONSUMER") {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    setLoading(true);
    console.log(API_BASE_URL)
    const token = await getToken();

    if (!token || !user || user.role !== "CONSUMER") {
      setLoading(false);
      console.warn("No token found or user role is not CONSUMER");
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}cart/detail/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && Array.isArray(response.data)) {
        const validItems = response.data.every(
          (item) =>
            item &&
            typeof item.quantity === "number" &&
            item.product &&
            typeof item.product.price === "string"
        );

        if (validItems) {
          setCart({
            items: response.data,
            totalItems: response.data.reduce(
              (acc, item) => acc + item.quantity,
              0
            ),
            totalPrice: response.data
              .reduce(
                (acc, item) =>
                  acc + item.quantity * parseFloat(item.product.price),
                0
              )
              .toFixed(2),
          });
        } else {
          console.error(
            "Invalid item structure in cart response:",
            response.data
          );
          setCart({
            items: [],
            totalItems: 0,
            totalPrice: 0,
          });
        }
      } else {
        console.error(
          "Unexpected response format or empty data:",
          response.data
        );
        setCart({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      alert("There was an error fetching your cart. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number) => {
    setLoading(true);
    const token = await getToken(); // await დაემატა
    try {
      const response = await axios.post(
        `${API_BASE_URL}cart/add/`,
        { product_id: product.id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const addedCartItem = response.data;
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

  const updateCartItem = async (cartItemId: number, quantity: number) => {
    setLoading(true);
    const token = await getToken();

    try {
      await axios.patch(
        `${API_BASE_URL}cart/update/${cartItemId}/`,
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
        const updatedTotalPrice = updatedItems.reduce(
          (acc, item) => acc + item.quantity * item.product.price,
          0
        );

        return {
          ...currentCart,
          items: updatedItems,
          totalItems: updatedTotalItems,
          totalPrice: parseFloat(updatedTotalPrice.toFixed(2)),
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
    const token = await getToken();
    alert("Are you sure you want to remove this item from your cart?");
    try {
      await axios.delete(`${API_BASE_URL}cart/remove/${productId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
          totalPrice: parseFloat(updatedTotalPrice.toFixed(2)),
        };
      });
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
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
