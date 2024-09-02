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

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <OilProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome">
              {/* <Stack.Screen name="Welcome" component={WelcomeScreen} /> */}
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Products" component={ProductsScreen} />
              <Stack.Screen name="ProductDetails" component={productDetails} />
              <Stack.Screen name="Main" component={Main} />
              <Stack.Screen name="AuthScreen" component={AuthScreen} />
              <Stack.Screen name="MyPageScreen" component={MyPageScreen} />
            </Stack.Navigator>
            <StatusBar style="auto" />
          </NavigationContainer>
        </OilProvider>
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
