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
  Image
} from "react-native";
import { useAI } from "@/context/aiContext";
import { useAuth } from "@/context/authContext";
import { useCart } from "@/context/cartContext";
import { Ionicons } from '@expo/vector-icons';
const ChatScreen = ({ navigation }: { navigation: any }) => {
  const { aiResponses, loading, error, fetchAIResponse } = useAI();
  const [input, setInput] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);
  const [carImage, setCarImage] = useState("");
  const { isLoggedIn } = useAuth();
  const flatListRef = useRef<FlatList>(null);
  const { addToCart } = useCart();



  useEffect(() => {
    console.log(aiResponses)
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [aiResponses]);

  // const handleSend = async () => {
  //   if (input.trim()) {
  //     const response = await fetchAIResponse(input); // Fetch bot response
  //     setCarImage(response.carImage); // Assuming the API response has a carImage field
  //     setInput("");
  //   }
  // };

  const handleSend = () => {
    if (input.trim()) {
      fetchAIResponse(input); // Fetch bot response, do not save user message
      setInput("");
    }
  };

  const handleAddToCart = (product: any) => {

  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 120}
      style={styles.container}>
      {error && <Text style={styles.error}>Error: {error}</Text>}
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
                    style={{ width: 50, height: 40 }}
                  />
                  <View >
                    <Text>დასახელება{product.name}</Text>
                    <Text>ფასი{product.price}</Text>
                    <Text>სიბლანტე{product.viscosity}</Text>
                    {/* how to import image from assets */}
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                      <TouchableOpacity><Text>-</Text></TouchableOpacity>
                      <View>
                        <Text>{product.quantity_for_user || 0}</Text>
                      </View>
                      <TouchableOpacity><Text>+</Text></TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleAddToCart(product)}
                      style={styles.callServiceButtonText}
                    >
                      <Ionicons name="cart" size={24} color={"red"} />
                      <Text style={{ color: "red", fontSize: 12 }}>კალათში დამატება</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleAddToCart(product)}
                      style={styles.callServiceButtonText}
                    >
                      <Ionicons name="construct-outline" size={24} color="red" />
                      <Text style={{ color: "red", fontSize: 12 }}>სერვისის გამოძახება</Text>
                    </TouchableOpacity>
                  </View>

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
    borderWidth: 1,
    height: 300,
    borderRadius: 8,
    marginTop: 10,
    padding: 10,
    shadowColor: "red",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  callServiceButtonText: {
    backgroundColor: "transparent",
    color: "red",
    // height: 50,
    borderRadius: 8,
    // padding: 10,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
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
