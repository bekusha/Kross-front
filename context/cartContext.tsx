import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { Product } from "@/types/product";
import { Cart, CartItem } from "@/types/cart";
import { useAuth } from "./authContext";
import { API_BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from 'react-native';
import { set } from "mongoose";
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
  // const [oilChangeOrders, setOilChangeOrders] = useState([]);
  const { user } = useAuth()!;
  const [oilChangeOrders, setOilChangeOrders] = useState<OilChangeOrder | null>(null);


  const [orderModalButtonVisible, setOrderModalButtonVisible] = useState(false);

  const getToken = async () => {
    return await AsyncStorage.getItem("access");
  };

  useEffect(() => {
    if (user && user.role === "CONSUMER") {
      fetchCart();
    }
  }, [user]);

  // receive array of products

  const purchase = async (
    orderItems: { product_id: number; quantity: number }[], // პროდუქტის სია
    orderType: "product_delivery" | "oil_change",          // შეკვეთის ტიპი
    additionalInfo: { phone: string; address: string; email: string } // დამატებითი ინფორმაცია
  ) => {
    const token = await getToken();

    if (!token) {
      console.error("User token not found.");
      Alert.alert("შეცდომა", "მომხმარებლის ავტორიზაცია საჭირო იქნება.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}order/purchase/`,
        {
          order_items: orderItems,       // პროდუქტის სია
          order_type: orderType,        // შეკვეთის ტიპი
          phone: additionalInfo.phone,  // ტელეფონი
          address: additionalInfo.address, // მისამართი
          email: additionalInfo.email,  // ელფოსტა
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { order_id, status } = response.data;

      if (response.status === 201) {
        Alert.alert(
          "შეკვეთა წარმატებით გაფორმდა",
          `Order ID: ${order_id}, Status: ${status}`
        );
        console.log("Order created successfully:", response.data);

        fetchOilChangeOrders(order_id);

        setOrderModalButtonVisible(true);


        // კალათის გასუფთავება შეკვეთის შემდეგ
        // setCart({
        //   items: [],
        //   totalItems: 0,
        //   totalPrice: 0,
        // });
      }
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  const fetchOilChangeOrders = async (order_id: number) => {
    try {
      const token = await getToken();
      const response = await axios.get(`${API_BASE_URL}order/${order_id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        setOilChangeOrders(response.data); // მონაცემების შენახვა სრულად
      }
    } catch (error) {
      console.error("Failed to fetch oil change orders:", error);
    }
  };



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

    Alert.alert(
      "პროდუქტის წაშლა",
      "ნამდვილად გსურთ პროდუქტის კალათიდან წაშლა?",
      [
        {
          text: "არა",
          onPress: () => setLoading(false),
          style: "cancel"
        },
        {
          text: "დიახ",
          onPress: async () => {
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
          }
        }
      ]
    );
  };



  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateCartItem,
    purchase,
    oilChangeOrders,
    orderModalButtonVisible,
    setOrderModalButtonVisible
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
