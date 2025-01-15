import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { Cart, CartItem } from "@/types/cart";
import { Product } from "@/types/product";
import { useAuth } from "./authContext";
import axiosInstance from "./axiosInstance";
import { API_BASE_URL } from "@env";


interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateCartItem: (productId: number, quantity: number) => Promise<void>;
  purchase: (
    orderItems: { product_id: number; quantity: number }[],
    orderType: "product_delivery" | "oil_change",
    additionalInfo: { phone: string; address: string; email: string }
  ) => Promise<void>;
  oilChangeOrders: any;
  orderModalButtonVisible: boolean;
  setOrderModalButtonVisible: (visible: boolean) => void;
}

const CartContext = createContext<CartContextType>({
  cart: null,
  loading: false,
  addToCart: async () => { },
  removeFromCart: async () => { },
  updateCartItem: async () => { },
  purchase: async () => { },
  oilChangeOrders: [],
  orderModalButtonVisible: false,
  setOrderModalButtonVisible: () => { },
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
  const [oilChangeOrders, setOilChangeOrders] = useState<any>(null);
  const [orderModalButtonVisible, setOrderModalButtonVisible] = useState(false);

  useEffect(() => {
    console.log("api base url", API_BASE_URL)
    if (user && user.role === "CONSUMER") {
      fetchCart();
    }
  }, [user]);

  const fetchOilChangeOrders = async (orderId: any) => {
    try {
      const response = await axiosInstance.get(`/order/${orderId}/`);
      setOilChangeOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch oil change orders:", error);
    }
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/cart/detail/");
      setCart({
        items: response.data,
        totalItems: response.data.reduce(
          (acc: number, item: CartItem) => acc + item.quantity,
          0
        ),
        totalPrice: response.data
          .reduce(
            (acc: number, item: CartItem) =>
              acc + item.quantity * parseFloat(item.product.price.toString()),
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

  const addToCart = async (product: Product, quantity: number) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/cart/add/", {
        product_id: product.id,
        quantity,
      });
      setCart((currentCart) => {
        if (!currentCart) {
          return {
            items: [{ ...response.data, product, quantity }],
            totalItems: quantity,
            totalPrice: parseFloat((product.price * quantity).toFixed(2)),
          };
        } else {
          const existingItemIndex = currentCart.items.findIndex(
            (item) => item.product.id === product.id
          );
          let updatedItems = [...currentCart.items];
          if (existingItemIndex !== -1) {
            updatedItems[existingItemIndex].quantity += quantity;
          } else {
            updatedItems.push({ ...response.data, product, quantity });
          }
          const updatedTotalItems = updatedItems.reduce(
            (acc, item) => acc + item.quantity,
            0
          );
          const updatedTotalPrice = updatedItems.reduce(
            (acc, item) => acc + item.quantity * parseFloat(item.product.price.toString()),
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

  const removeFromCart = async (productId: number) => {
    setLoading(true);
    Alert.alert(
      "პროდუქტის წაშლა",
      "ნამდვილად გსურთ პროდუქტის კალათიდან წაშლა?",
      [
        { text: "არა", onPress: () => setLoading(false), style: "cancel" },
        {
          text: "დიახ",
          onPress: async () => {
            try {
              await axiosInstance.delete(`/cart/remove/${productId}/`);
              setCart((currentCart) => {
                if (!currentCart) return null;
                const updatedItems = currentCart.items.filter(
                  (item) => item.product.id !== productId
                );
                const updatedTotalItems = updatedItems.reduce(
                  (acc, item) => acc + item.quantity,
                  0
                );
                const updatedTotalPrice = updatedItems.reduce(
                  (acc, item) =>
                    acc + item.quantity * parseFloat(item.product.price.toString()),
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
          },
        },
      ]
    );
  };

  const updateCartItem = async (cartItemId: number, quantity: number) => {
    setLoading(true);
    try {
      await axiosInstance.patch(`/cart/update/${cartItemId}/`, { quantity });
      setCart((currentCart) => {
        if (!currentCart) return null;
        const updatedItems = currentCart.items.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item
        );
        const updatedTotalItems = updatedItems.reduce(
          (acc, item) => acc + item.quantity,
          0
        );
        const updatedTotalPrice = updatedItems.reduce(
          (acc, item) => acc + item.quantity * parseFloat(item.product.price.toString()),
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

  const purchase = async (
    orderItems: { product_id: number; quantity: number }[],
    orderType: "product_delivery" | "oil_change",
    additionalInfo: { phone: string; address: string; email: string }
  ) => {
    try {
      const response = await axiosInstance.post("/order/purchase/", {
        order_items: orderItems,
        order_type: orderType,
        ...additionalInfo,
      });
      console.log("Order created successfully:", response.data);
      fetchCart();
      fetchOilChangeOrders(response.data.order_id);
      setOrderModalButtonVisible(true);
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateCartItem,
        purchase,
        oilChangeOrders,
        orderModalButtonVisible,
        setOrderModalButtonVisible,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
