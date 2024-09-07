import React, { useState } from "react";
import { useCart } from "@/context/cartContext";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const CartComponent = () => {
  const { cart, removeFromCart, updateCartItem } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = (productId: any, change: any) => {
    const item = cart?.items.find((item) => item.product.id === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        updateCartItem?.(productId, newQuantity);
      } else {
        removeFromCart?.(productId);
      }
    }
  };

  if (isCheckingOut) {
    return (
      <View style={styles.modal}>
        {/* Include your Checkout component here or another implementation */}
      </View>
    );
  }

  return (
    <ScrollView style={styles.cartContainer}>
      <TouchableOpacity style={styles.closeButton}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
      {cart && cart.items.length > 0 ? (
        cart.items.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Image
              source={{ uri: item.product.image1 }}
              style={styles.itemImage}
            />
            <Text style={styles.itemName}>{item.product.name}</Text>
            <Text style={styles.itemDescription}>
              {item.product.description}
            </Text>
            <Text style={styles.itemPrice}>ფასი: ${item.product.price}</Text>
            <View style={styles.quantityContainer}>
              <Button
                title="-"
                onPress={() => handleQuantityChange(item.product.id, -1)}
              />
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <Button
                title="+"
                onPress={() => handleQuantityChange(item.product.id, 1)}
              />
            </View>
            <Button
              title="Remove"
              onPress={() => removeFromCart(item.product.id)}
              color="#ff0000"
            />
          </View>
        ))
      ) : (
        <Text style={styles.emptyCartText}>თქვენი კალათი ცარიელია</Text>
      )}
      <View style={styles.summary}>
        <Text>ნივთების რაოდენობა: {cart?.totalItems || 0}</Text>
        <Text>ჯამური ფასი: ${cart?.totalPrice || 0}</Text>
      </View>
      <Button
        title="შეძენა"
        onPress={() => setIsCheckingOut(true)}
        color="#007bff"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cartContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  closeButtonText: {
    color: "#555",
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
    textAlign: "center",
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  emptyCartText: {
    textAlign: "center",
    fontSize: 18,
    color: "#999",
    marginVertical: 20,
  },
  summary: {
    marginTop: 20,
    padding: 10,
    borderTopColor: "#ddd",
    borderTopWidth: 1,
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default CartComponent;
