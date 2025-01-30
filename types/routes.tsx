// types.ts
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Product } from "./product";

// Define the type for stack parameter list
export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Products: { fromOilChangeScreen: boolean };
  ProductDetails: undefined;
  Main: undefined;
  AuthScreen: undefined;
  MyPageScreen: undefined;
  ContactScreen: undefined;
  // OilChangeScreen: undefined;
  OilChangeScreen: { orderItems?: Product[] };
};

// Define the type for Login screen navigation
export type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AuthScreen"
>;
