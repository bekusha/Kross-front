import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from "react-native";
import { useCart } from "@/context/cartContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import { API_BASE_URL } from "@env";

const Cart = () => {
  const { cart, removeFromCart } = useCart();
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [rotateAnims, setRotateAnims] = useState<{
    [key: number]: Animated.Value;
  }>({});

  useEffect(() => {
    // Initialize animation states for all cart items on mount
    if (cart && cart.items.length > 0) {
      const initialAnims = cart.items.reduce(
        (acc: { [key: number]: Animated.Value }, _, index: number) => {
          acc[index] = new Animated.Value(0);

          return acc;
        },
        {}
      );
      setRotateAnims(initialAnims);
    }
  }, [cart]);

  function getImageUrl(path: any) {
    if (path.startsWith("http")) {
      return path; // Path is already a full URL
    }
    return `${API_BASE_URL}${path}`;
  }

  const toggleExpand = (index: number) => {
    if (!rotateAnims[index]) return; // Ensure animation state exists

    const isExpanded = expandedItems.includes(index);
    if (isExpanded) {
      setExpandedItems(expandedItems.filter((i) => i !== index));
    } else {
      setExpandedItems([...expandedItems, index]);
    }

    // Trigger arrow rotation animation for the specific index
    Animated.timing(rotateAnims[index], {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleRemoveFromCart = (productId: number) => {
    removeFromCart(productId);
  };

  return (
    <View style={styles.cartContainer}>
      {cart && cart.items.length > 0 ? (
        <ScrollView>
          {cart.items.map((item, index) => {
            const rotateAnim = rotateAnims[index] || new Animated.Value(0); // Safe fallback

            const rotateInterpolate = rotateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["0deg", "180deg"],
            });

            return (
              <View key={index} style={styles.cartItem}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.product.name}</Text>
                  <Text>{item.product.price} ლ</Text>
                  <TouchableOpacity onPress={() => toggleExpand(index)}>
                    <Animated.View
                      style={{
                        transform: [{ rotate: rotateInterpolate }],
                      }}>
                      <Icon name="expand-more" size={24} color="black" />
                    </Animated.View>
                  </TouchableOpacity>
                </View>
                {expandedItems.includes(index) && (
                  <View style={styles.itemDetails}>
                    <Image
                      source={{ uri: getImageUrl(item.product.image1) }}
                      style={styles.itemImage}
                    />

                    <Text>რაოდენობა: {item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => removeFromCart(item.id)}
                      style={[styles.button, styles.removeButton]}>
                      <Text style={styles.buttonText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View>
          <Text>შენი კალათი ცარიელია</Text>
        </View>
      )}
      <View style={styles.summary}>
        <Text style={styles.checkoutInfo}>ნივთების რაოდენობა: {cart?.totalItems || 0}</Text>
        {/* i want to bold only ჯამური ფასი */}

        <Text style={styles.checkoutInfo}>ჯამური ფასი: <Text>{cart?.totalPrice || 0} ლ</Text></Text>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.buttonText}>შეძენა</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  cartContainer: {
    width: "80%",
    height: "68%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 50,
  },
  cartItem: {
    marginVertical: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  itemDetails: {
    marginTop: 10,
    alignItems: "center",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,

    backgroundColor: "black"
  },

  buttonText: {
    color: "red",






  },
  removeButton: {
    backgroundColor: "red",
  },
  checkoutButton: {
    backgroundColor: "black",
    width: 160,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
  },
  checkoutInfo: {
    fontWeight: "bold",
  },
  summary: {
    marginTop: 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Cart;
