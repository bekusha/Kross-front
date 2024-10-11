import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
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
import { CartProvider } from "./context/cartContext";
import OilChangeScreen from "./screens/OilChangeScreen";
import { OilChangeProvider } from "./context/OilChangeContext";
import * as Font from "expo-font";
import { Text } from "react-native";
import { Image } from "react-native";




export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

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
                    <Stack.Screen
                      name="Home"
                      component={HomeScreen}
                      options={{
                        headerTitle: () => {
                          return (
                            <View style={styles.logoContainer}>
                              <Image source={require("./assets/logo.jpg")} style={styles.logo} />
                            </View>
                          );
                        },
                        headerTitleAlign: "center", // ცენტრში მოთავსება
                        headerStyle: {
                          backgroundColor: "red", // ფონის ფერი
                        },
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
    backgroundColor: "red",
    justifyContent: "center",
    width: "100%",

  },
  logoContainer: {
    display: "flex",
    width: "100%",
    borderBottomWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "red"
  },
  logo: {
    width: 150,
    height: 80,


    resizeMode: "contain", // სურათი ჩაჯდება კონტეინერში პროპორციების დაცვით
    zIndex: 1
  },
});