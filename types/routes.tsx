// types.ts
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Define the type for stack parameter list
export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Products: undefined;
  ProductDetails: undefined;
  Main: undefined;
  AuthScreen: undefined;
  MyPageScreen: undefined; // Ensure this matches your route name
};

// Define the type for Login screen navigation
export type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AuthScreen"
>;
