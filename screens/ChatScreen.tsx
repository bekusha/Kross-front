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
import { API_BASE_URL } from "@env";
const ChatScreen = ({ navigation }: { navigation: any }) => {
  const { aiResponses, loading, error, fetchAIResponse } = useAI();
  const [input, setInput] = useState("");
  // const [modalVisible, setModalVisible] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const { addToCart } = useCart();
  // const [quantity, setQuantity] = useState(1);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  // FOR MAIN CALCULATOR
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalLiters, setTotalLiters] = useState(0);

  useEffect(() => {
    calculateTotals();
  }, [quantities]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 300);
    console.log("AI Responses:", JSON.stringify(aiResponses, null, 2));
    return () => clearTimeout(timeout);
  }, [aiResponses]);

  const handleCallService = (product: Product) => {
    if (!product) {
      console.error("Product is missing!");
      return;
    }
    const quantity = quantities[product.id] || 1;

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


  const handleOrder = (orderType: "cart" | "service", products: Product[]) => {
    if (orderType === "cart") {
      products.forEach(product => addToCart(product, product.recommended_quantity || 1));
      Alert.alert("პროდუქტები დაემატა კალათაში", "შეგიძლიათ იხილოთ კალათაში");
    } else if (orderType === "service") {
      navigation.navigate("OilChangeScreen", {
        orderItems: products,  // 🛠️ აქ ვაგზავნით products მთლიანად!
        orderType: "oil_change",
        additionalInfo: { phone: "", address: "", email: "" },
      });
    }
  };




  const calculateTotals = () => {
    let price = 0;
    let liters = 0;

    aiResponses.forEach((item) => {
      item.products.forEach((product) => {
        const quantity = quantities[product.id] || 0;
        price += quantity * product.price;
        liters += quantity * product.liter;
      });
    });

    setTotalPrice(price);
    setTotalLiters(liters);
  };


  const handleSend = () => {
    if (input.trim()) {
      fetchAIResponse(input); // Fetch bot response, do not save user message
      setInput("");
    }
  };

  // const handleAddToCart = (product: any) => {
  //   const quantity = quantities[product.id] || 1;
  //   addToCart(product, quantity);
  //   Alert.alert(
  //     "პროდუქტი წარმატებით დაემატა",
  //     "შეგიძლიათ იხილოთ თაბზე, ჩემი გვერდი",
  //     [
  //       {
  //         text: "OK",
  //         onPress: () => navigation.navigate("Cart"),
  //       },
  //     ],
  //     { cancelable: false }
  //   )
  // };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 120}
      style={styles.container}>
      {error && <Text>{typeof error === "string" ? error : JSON.stringify(error)}</Text>}

      {loading && (
        <ActivityIndicator
          size={50}
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      )}
      {aiResponses.length === 0 ? (
        <View style={styles.emptyChatContainer}>
          <Ionicons name="chatbubble-ellipses-outline" size={60} color="gray" />
          <Text style={styles.emptyChatTitle}>ჩაწერე შენი მანქანის მონაცემები</Text>
          <Text style={styles.emptyChatText}>
            მაგალითად: "Toyota Corolla 2008, 1.6 ბენზინი"
          </Text>
          <Text style={styles.emptyChatText}>
            ბოტი გირჩევს შესაბამის ზეთს და გამოთვლის საჭირო რაოდენობას.
          </Text>
          <Ionicons name="car-outline" size={50} color="gray" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={aiResponses || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const totalLiters = item.products?.reduce((acc: any, product: Product) => acc + product.recommended_quantity! * product.liter, 0);
            const totalPrice = item.products?.reduce((acc: any, product: Product) => acc + product.recommended_quantity! * product.price, 0);

            return (
              <View style={styles.botResponseCard}>
                <Text style={styles.messageText}>{item.message}</Text>
                <View style={styles.productContainer}>
                  {item.products.map((product: Product, index: any) => (
                    <View key={index} style={styles.productRow}>

                      <Text style={styles.productTitle}>{product.name}</Text>
                      <Text>ცალი ({product.liter} ლ/ბოთლი)</Text>
                      <Text>რაოდენობა: {product.recommended_quantity}ც</Text>
                      <Text style={{ color: "red" }}>ფასი: {product.recommended_quantity! * product.price} ლარი</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.summaryContainer}>
                  <Text style={styles.summaryText}>საერთო ლიტრები: {totalLiters} ლ</Text>
                  <Text style={styles.summaryText}>საერთო ფასი: {totalPrice} ლ</Text>
                </View>
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity onPress={() => handleOrder("cart", item.products)} style={styles.actionButton}>
                    <Ionicons name="cart" size={24} color={"white"} />
                    <Text style={styles.actionButtonText}>კალათაში დამატება</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleOrder("service", item.products)} style={styles.actionButton}>
                    <Ionicons name="construct-outline" size={24} color="white" />
                    <Text style={styles.actionButtonText}>სერვისის გამოძახება</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          showsVerticalScrollIndicator={false}
        />
      )}



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
      {/* <Modal
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
      </Modal> */}
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
    marginBottom: 100,
  },
  input: {
    flex: 1,
    height: 60,
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
  summaryContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "bold",
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
  productContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  productRow: {
    marginBottom: 10,
  },
  // productTitle: {
  //   fontSize: 16,
  //   fontWeight: "bold",
  // },
  actionButtonsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 10,

  },
  actionButton: {
    backgroundColor: "red",
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

  emptyChatContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    textAlign: "center",
  },
  emptyChatTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginVertical: 10,
  },
  emptyChatText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 5,
  },


});

export default ChatScreen;
