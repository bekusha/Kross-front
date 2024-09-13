import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./screens/WelcomeScreen";
import HomeScreen from "./screens/HomeScreen";
import { ProductProvider } from "./context/productContext";
import { AuthProvider } from "./context/authContext";
import React from "react";
import ProductsScreen from "./screens/ProductsScreen";
import Main from "./screens/Main";
const Stack = createNativeStackNavigator();
import productDetails from "./screens/productDetails";
import AuthScreen from "./screens/AuthScreen";
import MyPageScreen from "./screens/MyPageScreen";
import { OilProvider } from "./context/oilContext";
import { AIProvider } from "./context/aiContext";
import ChatScreen from "./screens/ChatScreen";
import { CartProvider } from "./context/cartContext";
import OilChangeScreen from "./screens/OilChangeScreen";
import { OilChangeProvider } from "./context/OilChangeContext";

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <OilChangeProvider>
            <AIProvider>
              <OilProvider>
                <NavigationContainer>
                  <Stack.Navigator initialRouteName="Welcome">
                    {/* <Stack.Screen name="Welcome" component={WelcomeScreen} /> */}
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Products" component={ProductsScreen} />
                    <Stack.Screen
                      name="ProductDetails"
                      component={productDetails}
                    />
                    <Stack.Screen name="Main" component={Main} />
                    <Stack.Screen name="AuthScreen" component={AuthScreen} />
                    <Stack.Screen
                      name="MyPageScreen"
                      component={MyPageScreen}
                    />
                    <Stack.Screen name="ChatScreen" component={ChatScreen} />
                    <Stack.Screen
                      name="OilChangeScreen"
                      component={OilChangeScreen}
                    />
                  </Stack.Navigator>
                  {/* <StatusBar style="auto" /> */}
                </NavigationContainer>
              </OilProvider>
            </AIProvider>
          </OilChangeProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
