import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
  Alert
} from "react-native";
import { useAI } from "@/context/aiContext";
import { useAuth } from "@/context/authContext";
import { useCart } from "@/context/cartContext";
import { Ionicons } from '@expo/vector-icons';
import { Product } from "@/types/product";
const ChatScreen = ({ navigation }: { navigation: any }) => {
  const { aiResponses, loading, error, fetchAIResponse } = useAI();
  const [input, setInput] = useState("");
  const [modalVisible, setModalVisible] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);



  useEffect(() => {
    const timeout = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 300);
    return () => clearTimeout(timeout);
  }, [aiResponses]);

  const handleCallService = (product: Product) => {
    if (!product) {
      console.error("Product is missing!");
      return;
    }

    console.log("Selected product:", JSON.stringify(product, null, 2));

    const orderItems = [
      { product_id: product.id, quantity: quantity, product: product },
    ];
    const orderType = "oil_change";
    const additionalInfo = {
      phone: "",
      address: "",
      email: "",
    };

    navigation.navigate("OilChangeScreen", {
      orderItems,
      orderType,
      additionalInfo,
      selectedProduct: product,
      quantity,
    });
  };





  const handleSend = () => {
    if (input.trim()) {
      fetchAIResponse(input); // Fetch bot response, do not save user message
      setInput("");
    }
  };

  const handleAddToCart = (product: any) => {
    addToCart(product, quantity);
    Alert.alert(
      "პროდუქტი წარმატებით დაემატა",
      "შეგიძლიათ იხილოთ თაბზე, ჩემი გვერდი",
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("Cart"),
        },
      ],
      { cancelable: false }
    )
  };
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 120}
      style={styles.container}>
      {error && <Text>{typeof error === "string" ? error : JSON.stringify(error)}</Text>}

      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      )}
      <FlatList
        ref={flatListRef}
        data={aiResponses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.botResponseCard}>
            <Text style={styles.messageText}>{item.message}</Text>

            {/* პროდუქტის რენდერი map ფუნქციით */}
            {item.products && item.products.map((product: any, index: any) => (
              <View style={styles.productCard} key={index} >

                <View style={{ flexDirection: "row" }}>
                  <Image source={require('assets/engine.webp')}
                    style={{ width: 50, height: 40, borderRadius: 10, marginRight: 5 }}
                  />
                  <View style={{ justifyContent: "flex-start" }}>
                    <Text style={styles.productTitle}>{product.name}</Text>


                    {/* how to import image from assets */}

                  </View>

                </View>
                <View style={styles.calculateButtonsContainer}>

                  {/* <Text style={{ margin: 0 }}>ნივთის რაოდენობა: </Text> */}
                  <TouchableOpacity onPress={decrementQuantity}><Text style={styles.calculatorButtons}>-</Text></TouchableOpacity>
                  <View>
                    <Text style={styles.calculatorButtons}>{quantity}</Text>
                  </View>
                  <TouchableOpacity onPress={incrementQuantity}><Text style={styles.calculatorButtons}>+</Text></TouchableOpacity>
                </View>
                <Text style={{ textAlign: "center" }}>რაოდენობა: {quantity * product.liter} ლიტრი</Text>
                <Text style={{ color: "red", textAlign: "center", marginTop: 10 }} >ფასი:{quantity * product.price} ლარი</Text>
                <View style={{ justifyContent: "flex-start" }}>
                  <TouchableOpacity
                    onPress={() => handleAddToCart(product)}
                    style={styles.callServiceButtonText}
                  >
                    <Ionicons name="cart" size={24} color={"red"} />
                    <Text style={{ color: "red", fontSize: 14 }}>კალათში დამატება</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleCallService(product)}
                    style={styles.callServiceButtonText}
                  >
                    <Ionicons name="construct-outline" size={24} color="red" />
                    <Text style={{ color: "red", fontSize: 14 }}>სერვისის გამოძახება</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="მარკა, მოდელი, ძრავი, წელი"
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>გაგზავნა</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Component */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              მიაწოდე შემდეგი ინფორმაცია : მარკა, მოდელი, ძრავი, წელი
              და ბოტი დაგიბრუნებს შესაბამის ინფორმაციას, სხვა შემთხვევაში შესაძლოა დაბრუნდეს შეცდომა
            </Text>
            <TouchableOpacity
              style={styles.okButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.okButtonText}>გასაგებია</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  chatContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  // productTitle: {
  //   fontSize: 14,
  //   fontWeight: "bold",
  //   marginBottom: 5,
  //   width: "80%",
  //   marginLeft: 10,
  // },
  sendButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  botResponseCard: {
    backgroundColor: "#e1e1e1",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    alignSelf: "center",
    maxWidth: "80%",
  },
  productCard: {
    backgroundColor: "#ffffff",
    borderWidth: 0,
    borderRadius: 10,
    marginVertical: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  productPrice: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,

  },
  actionButton: {
    backgroundColor: "#ff6347",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "500",
    marginHorizontal: 10,
  },

  callServiceButtonText: {
    backgroundColor: "black",
    color: "red",
    // height: 50,
    borderRadius: 8,
    // padding: 10,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
    padding: 10,
  },
  calculateButtonsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    backgroundColor: "#f1f1f1",
    textAlign: "center",
    padding: 5,
    borderRadius: 6,
    height: 40,
  },
  calculatorButtons: {
    width: 30,
    height: 30,
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  detailPageButtonText: {
    color: "red",
  },

  messageText: {
    fontSize: 16,
  },
  loadingIndicator: {
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  okButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 10,
  },
  okButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ChatScreen;
