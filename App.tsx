import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./screens/WelcomeScreen";
import HomeScreen from "./screens/HomeScreen";
import { ProductProvider } from "./context/productContext";
import React from "react";
import ProductsScreen from "./screens/ProductsScreen";
import Main from "./screens/Main";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ProductProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Products" component={ProductsScreen} />
          <Stack.Screen name="Main" component={Main} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </ProductProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
