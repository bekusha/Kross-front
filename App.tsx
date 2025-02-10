import React, { useState } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthProvider } from "./context/authContext";
import { ProductProvider } from "./context/productContext";
import { CartProvider, useCart } from "./context/cartContext";
import { AIProvider } from "./context/aiContext";
import ProductsScreen from "./screens/ProductsScreen";
import ProductDetails from "./screens/productDetails";
import MyPageScreen from "./screens/MyPageScreen";
import ContactScreen from "./screens/ContactScreen";
import Main from "./screens/Main";
import ChatScreen from "./screens/ChatScreen";
import OilChangeScreen from "./screens/OilChangeScreen";
import Icon from 'react-native-vector-icons/MaterialIcons';
import OrderButton from "./components/OrderButton";
import OrderModal from "./components/OrderModal";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get('window');

export default function App() {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const { orderModalButtonVisible, setOrderModalButtonVisible } = useCart();

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
            <NavigationContainer>
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
              )}
              <Tab.Navigator
                screenOptions={{
                  headerTitle: () => (
                    <View style={styles.headerContainer}>
                      <Image source={require("./assets/logo.jpg")} style={styles.logo} />
                    </View>
                  ),
                  headerStyle: { backgroundColor: "red" },
                  headerTitleAlign: "center", // ჰედერის ტექსტი ან ლოგო ცენტრში
                  headerTintColor: "white",
                  tabBarStyle: {
                    backgroundColor: "#ecf0f1",
                    position: "absolute",
                    bottom: 0,
                    zIndex: 9999,
                  },
                  tabBarActiveTintColor: "red",
                  tabBarInactiveTintColor: "black",
                }}
              >
                {/* მთავარი */}
                <Tab.Screen
                  name="Main"
                  component={HomeStack}
                  options={{
                    title: "მთავარი",
                    tabBarIcon: ({ color, size }: any) => (
                      <Icon name="home" color={color} size={size} />
                    ),
                  }}
                />


                {/* ჩემი გვერდი */}
                <Tab.Screen
                  name="MyPage"
                  component={MyPageScreen}
                  options={{
                    title: "ჩემი გვერდი",
                    tabBarIcon: ({ color, size }: any) => (
                      <Icon name="person" color={color} size={size} />
                    ),
                  }}
                />

                {/* კონტაქტი */}
                <Tab.Screen
                  name="Contact"
                  component={ContactScreen}
                  options={{
                    title: "კონტაქტი",
                    tabBarIcon: ({ color, size }: any) => (
                      <Icon name="phone" color={color} size={size} />
                    ),
                  }}
                />
              </Tab.Navigator>
            </NavigationContainer>
          </AIProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Main}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Products" component={ProductsScreen} options={{ title: "პროდუქტები" }} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ title: "პროდუქტის დეტალები" }} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: "ჩატი" }} />
      <Stack.Screen name="OilChangeScreen" component={OilChangeScreen} options={{ title: "სერვისის გამოძახება" }} />
    </Stack.Navigator>
  );
}


const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderRadius: 10,


  },
  logo: {
    width: width / 3,
    height: height / 15,
    resizeMode: "contain",
    position: "absolute", // Allows logo to move beyond header
    bottom: -5, // Moves logo slightly upwards
    borderRadius: 15,
    backgroundColor: "red",

  },
});

