import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import { useCart } from "@/context/cartContext"; // Assuming you have a similar context in your React Native project

const Cart = () => {
  const { cart, removeFromCart, updateCartItem } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // function getImageUrl(path) {
  //   if (path.startsWith("http")) {
  //     return path; // Path is already a full URL
  //   }
  //   return `${process.env.NEXT_PUBLIC_API_BASE}${path}`;
  // }

  // const handleQuantityChange = (productId, change) => {
  //   const item = cart?.items.find((item) => item.id === productId);
  //   if (item) {
  //     const newQuantity = item.quantity + change;
  //     if (newQuantity > 0) {
  //       updateCartItem?.(productId, newQuantity);
  //     } else {
  //       removeFromCart?.(productId);
  //     }
  //   }
  // };

  if (isCheckingOut) {
    return (
      <Modal visible={true} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* <Checkout /> */}
            <TouchableOpacity
              onPress={() => setIsCheckingOut(false)}
              style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View style={styles.cartContainer}>
      {/* <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity> */}
      {cart && cart.items.length > 0 ? (
        <ScrollView>
          {cart.items.map((item, index) => (
            <View key={index} style={styles.cartItem}>
              <Text style={styles.itemName}>{item.product.name}</Text>
              <View style={styles.itemDetails}>
                {/* <Image
                  source={{ uri: getImageUrl(item.product.image1) }}
                  style={styles.itemImage}
                /> */}
                {/* <TouchableOpacity
                  onPress={() => handleQuantityChange(item.id, -1)}
                  style={styles.quantityButton}>
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>Qty: {item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => handleQuantityChange(item.id, 1)}
                  style={styles.quantityButton}>
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity> */}
              </View>
              <TouchableOpacity
                onPress={() => removeFromCart(item.id)}
                style={[styles.button, styles.removeButton]}>
                <Text style={styles.buttonText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text>Your cart is empty</Text>
      )}
      <View style={styles.summary}>
        <Text>
          <strong>ნივთების რაოდენობა:</strong> {cart?.totalItems || 0}
        </Text>
        <Text>
          <strong>ჯამური ფასი:</strong> ${cart?.totalPrice || 0}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => setIsCheckingOut(true)}
        style={[styles.button, styles.checkoutButton]}>
        <Text style={styles.buttonText}>შეძენა</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cartContainer: {
    position: "absolute",
    right: 0,
    top: 20,
    width: "80%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 50,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeButtonText: {
    color: "gray",
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    maxWidth: "50%",
  },
  itemDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  quantityButton: {
    backgroundColor: "gray",
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  removeButton: {
    backgroundColor: "red",
  },
  checkoutButton: {
    backgroundColor: "blue",
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: "red",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  summary: {
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    width: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default Cart;
