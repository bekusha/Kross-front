import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, TouchableOpacity, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./screens/WelcomeScreen";
import HomeScreen from "./screens/HomeScreen";
import { ProductProvider } from "./context/productContext";
import { AuthProvider } from "./context/authContext";
import React, { useEffect, useState } from "react";
import ProductsScreen from "./screens/ProductsScreen";
import Main from "./screens/Main";
const Stack = createNativeStackNavigator();
import productDetails from "./screens/productDetails";
import AuthScreen from "./screens/AuthScreen";
import MyPageScreen from "./screens/MyPageScreen";
import { OilProvider } from "./context/oilContext";
import { AIProvider } from "./context/aiContext";
import ChatScreen from "./screens/ChatScreen";
import { CartProvider, useCart } from "./context/cartContext";
import OilChangeScreen from "./screens/OilChangeScreen";
import * as Font from "expo-font";
import { Text } from "react-native";
import { Image } from "react-native";
import { Dimensions } from 'react-native';
// import { Platform } from "react-native";
import ContactScreen from "./screens/ContactScreen";
import Icon from 'react-native-vector-icons/MaterialIcons';
import OrderButton from "./components/OrderButton";
import OrderModal from "./components/OrderModal";
// import { Settings } from 'react-native-fbsdk-next';
// import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';







const { width } = Dimensions.get('window');
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const { orderModalButtonVisible, setOrderModalButtonVisible } = useCart();



  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "Roboto-Regular": require("./assets/fonts/NotoSansGeorgian.ttf"),
        "AnaKalandadze": require("./assets/fonts/Ana-Kalandadze_2.ttf"),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  const handleOrderModal = (value: boolean) => {
    console.log("Before toggle", showOrderModal)
    setShowOrderModal(!value);
    console.log("After toggle", !value)
  }


  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <AIProvider>
            <OilProvider>
              <NavigationContainer>
                <Stack.Navigator initialRouteName="Welcome" >
                  {/* <Stack.Screen name="Welcome" component={WelcomeScreen} /> */}
                  <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                      header: () => (
                        <View style={styles.headerContainer}>
                          <Image
                            source={require("./assets/logo.jpg")}
                            style={styles.logo}
                          />
                        </View>
                      ),
                      headerTitleAlign: "center", // ცენტრში მოთავსება
                      headerStyle: styles.header,

                      title: "", // სახელი გამორთულია, სტანდარტული წარწერა არ გამოჩნდება
                    }}
                  />


                  <Stack.Screen name="Products" component={ProductsScreen} options={{
                    headerTitle: () => {
                      return (
                        <View><Text style={{ color: "white", fontSize: 20, textAlign: "center", letterSpacing: 1 }}>პროდუქტები</Text></View>

                      );
                    },

                    headerStyle: {
                      backgroundColor: "red",
                    },
                    title: "",
                    headerTitleAlign: "center",
                    headerTintColor: "white",

                  }} />

                  <Stack.Screen
                    name="ProductDetails"
                    component={productDetails}
                    options={{
                      headerTitle: () => {
                        return (
                          <View><Text style={{ color: "white", fontSize: 20, textAlign: "center", letterSpacing: 1 }}>დეტალური განხილვა</Text></View>

                        );
                      },
                      title: "",
                      headerTitleAlign: "center",
                      headerTintColor: "white",
                      headerStyle: {
                        backgroundColor: "red",
                      }
                    }}
                  />
                  <Stack.Screen name="Main" component={Main} options={{ title: "შენი საიმედო პარტნიორი" }} />
                  <Stack.Screen name="ContactScreen" component={ContactScreen} options={{ title: "კონტაქტი" }} />
                  <Stack.Screen name="AuthScreen" component={AuthScreen} options={{
                    headerTitle: () => {
                      return (
                        <View><Text style={{ color: "white", fontSize: 20, textAlign: "center", letterSpacing: 1 }}>ავტორიზაცია</Text></View>

                      );
                    },
                    title: "",
                    headerTitleAlign: "center",
                    headerTintColor: "white",
                    headerStyle: {
                      backgroundColor: "red",
                    }
                  }} />
                  <Stack.Screen
                    name="MyPageScreen"
                    component={MyPageScreen}
                    options={{ title: "ჩემი გვერდი" }}
                  />
                  <Stack.Screen name="ChatScreen" component={ChatScreen} options={{
                    headerTitle: () => {
                      return (
                        <View><Text style={{ color: "white", fontSize: 20, textAlign: "center", letterSpacing: 1 }}>მიიღე ინფორმაცია ავტომობილებზე</Text></View>

                      );
                    }, headerStyle: {
                      backgroundColor: "red", // ფონის ფერი
                    },
                    headerTintColor: "white",
                  }} />
                  <Stack.Screen
                    name="OilChangeScreen"
                    component={OilChangeScreen}
                    options={{
                      title: "სერვისის გამოძახება", headerStyle: {
                        backgroundColor: "red", // ფონის ფერი
                      }
                    }}
                  />

                </Stack.Navigator>
                <OrderButton
                  onPress={() => handleOrderModal(showOrderModal)}
                  visible={orderModalButtonVisible}
                  initialPosition={{ top: 700, left: 300 }} // პოზიციის განსაზღვრა
                />
                {/* <StatusBar style="auto" /> */}
                {showOrderModal && (
                  <OrderModal
                    visible={showOrderModal} // მართავს მოდალის ხილვადობას
                    onClose={() => setShowOrderModal(false)} // დახურვის ფუნქცია
                  />
                  // <View style={styles.modalContainer}>
                  //   <Text style={styles.modalText}>Order Modal Content</Text>
                  //   <TouchableOpacity onPress={() => setShowOrderModal(false)} style={styles.closeButton}>
                  //     <Text style={styles.closeButtonText}>Close</Text>
                  //   </TouchableOpacity>
                  // </View>
                )}

              </NavigationContainer>
            </OilProvider>
          </AIProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 80, // ჰედერის საჭირო სიმაღლე
    backgroundColor: "red", // ჰედერის ფერი
    justifyContent: "center", // ლოგოს ცენტრში მოთავსება
    alignItems: "center",
    position: "relative",
  },



  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
    position: "absolute",
    top: 50,

    borderRadius: 10,
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  header: {
    width: "100%",
    height: 100, // ჰედერის გაზრდილი სიმაღლე
    backgroundColor: "red",
    justifyContent: "center", // კონტეინერის შიგთავსის ცენტრში განთავსება
    alignItems: "center",
    overflow: "visible", // დარწმუნდით, რომ არაფერი დაიმალება
  },
  timerButton: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    backgroundColor: '#D32F2F', // Match footer color
    borderRadius: 50, // Circular button
    width: 60, // Set width to 50
    height: 60, // Set height to 50
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // ნახევრად გამჭვირვალე ფონი
  },
  modalText: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});