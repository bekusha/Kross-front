import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Alert,
  Modal,
  TextInput
} from "react-native";
import { useCart } from "@/context/cartContext";
import Icon from "react-native-vector-icons/MaterialIcons";


const Cart = () => {
  const { cart, removeFromCart, purchase, clearCart, orderModalButtonVisible } = useCart();
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState({
    phone: "",
    address: "",
    email: "",
  })
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


  const handlePurchase = async () => {
    if (!cart || cart.items.length === 0) {
      Alert.alert("შეცდომა", "თქვენი კალათი ცარიელია!");
      return;
    }

    const orderItems = cart.items.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
    }));



    try {
      if (!additionalInfo.phone || !additionalInfo.address) {
        Alert.alert("შეცდომა", "გთხოვთ შეავსოთ ველები");
        return;
      }
      await purchase(orderItems, "product_delivery", additionalInfo);
      setIsModalVisible(false)


      clearCart();

      // setIsModalVisible(false);
    } catch (error) {
      console.error("Failed to purchase:", error);
      Alert.alert("შეცდომა", "შეკვეთის გაფორმება ვერ მოხერხდა.");
    }

  };



  const handleRemoveFromCart = (productId: number) => {
    removeFromCart(productId);
  };

  return (
    <View style={styles.container}>
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

                  <Icon style={{ fontSize: 25 }} onPress={() => {
                    handleRemoveFromCart(item.id)
                  }} name="delete" />
                </View>
                <Text>რაოდენობა: {item.quantity} ცალი</Text>
                <Text>თითო ნივთის ფასი: {item.product.price} ლ</Text>

              </View>
            );
          })}
        </ScrollView>
      ) : (
        <Text>თქვენი კალათა ცარიელია!</Text>
      )}
      <View style={styles.summary}>
        <Text style={[styles.emptyCart]}> სულ {cart?.totalItems || 0} სახეობის პროდუქცია</Text>
        {/* i want to bold only ჯამური ფასი */}

        <Text style={styles.checkoutInfo}>ჯამური ფასი: <Text>{cart?.totalPrice || 0} ლ</Text></Text>

        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.checkoutButton}>
          <Text style={styles.buttonText}>შეძენა</Text>
        </TouchableOpacity>
      </View>


      {/* Modal for additionalInfo */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>შეიყვანეთ ინფორმაცია</Text>

            {/* Input for Phone */}
            <TextInput
              style={styles.input}
              placeholder="ტელეფონი"
              keyboardType="phone-pad"
              value={additionalInfo.phone}
              onChangeText={(text) =>
                setAdditionalInfo((prev) => ({ ...prev, phone: text }))
              }
            />

            {/* Input for Address */}
            <TextInput
              style={styles.input}
              placeholder="მისამართი"
              value={additionalInfo.address}
              onChangeText={(text) =>
                setAdditionalInfo((prev) => ({ ...prev, address: text }))
              }
            />

            {/* Input for Email */}
            {/* <TextInput
              style={styles.input}
              placeholder="ელფოსტა"
              keyboardType="email-address"
              value={additionalInfo.email}
              onChangeText={(text) =>
                setAdditionalInfo((prev) => ({ ...prev, email: text }))
              }
            /> */}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={[styles.button, styles.cancelButton]}
              >
                <Text style={styles.buttonText}>გაუქმება</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handlePurchase}
                style={[styles.button, styles.confirmButton]}
              >
                <Text style={styles.buttonText}>დადასტურება</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>);
};

const styles = StyleSheet.create({
  cartContainer: {
    width: "100%",
    height: "68%",
    backgroundColor: "white",

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

    width: "100%",
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
    fontSize: 12,
  },
  emptyCartContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyCart: {
    color: 'rgba(211, 47, 47, 1)',
  },
  summary: {
    marginTop: 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  // checkoutButton: {
  //   backgroundColor: "#000",
  //   padding: 16,
  //   borderRadius: 8,
  //   marginTop: 16,
  //   alignItems: "center",
  // },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#ddd",
  },
  confirmButton: {
    backgroundColor: "#000",
  },


});

export default Cart;