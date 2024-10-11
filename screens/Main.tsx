import React, { useEffect, useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { useProducts } from "../context/productContext"; // Import the useProducts hook
import { useAuth } from "@/context/authContext";

type MainProps = {
  navigation: any;
};

const Main: React.FC<MainProps> = ({ navigation }) => {
  const { categories } = useProducts(); // Use the categories from context
  const { isLoggedIn } = useAuth();
  // Define static content with appropriate category IDs from the fetched data
  const content = [
    {
      text: "გამოიძახე ზეთის შეცვლა ადგილზე",
      image: require("../assets/oilchangedelivery.webp"),
      action: () => {
        if (isLoggedIn) {
          console.log("User is logged in");
          navigation.navigate("OilChangeScreen");
        } else {
          // Optionally, navigate to the login screen or show a message
          navigation.navigate("AuthScreen"); // Redirect to login
        }
      },
    },
    {
      text: "მიიღე ავტომობილზე ინფორმაცია ბოტისგან",
      image: require("../assets/aikrossbot.webp"),
      action: () => navigation.navigate("ChatScreen"),
    },
    {
      text: "ძრავის ზეთები",
      image: require("../assets/engine.webp"),
      action: () => {
        const category = categories.find((cat) => cat.name === "ძრავის ზეთები");
        if (category) {
          navigation.navigate("Products", { categoryId: category.id }); // Use fetched category ID
        }
      },
    },
    {
      text: "გადაცემათა კოლოფის ზეთები",
      image: require("../assets/gearbox.webp"),
      action: () => {
        const category = categories.find(
          (cat) => cat.name === "გადაცემათა კოლოფის ზეთები"
        );
        if (category) {
          navigation.navigate("Products", { categoryId: category.id }); // Use fetched category ID
        }
      },
    },
    {
      text: "საწმენდი საშუალებები",
      image: require("../assets/cleaning.webp"),
      action: () => {
        const category = categories.find(
          (cat) => cat.name === "საწმენდი საშუალებები"
        );
        if (category) {
          navigation.navigate("Products", { categoryId: category.id }); // Use fetched category ID
        }
      },
    },
    {
      text: "ყველა პროდუქტი",
      image: require("../assets/shop.webp"),
      action: () => navigation.navigate("Products", { categoryId: null }), // Null for all products
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        {content.map((item, index) => (
          <View key={index} style={styles.cardWrapper}>
            <Text style={styles.cardText}>{item.text}</Text>
            <TouchableOpacity style={styles.card} onPress={item.action}>
              <Image style={styles.image} source={item.image} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    padding: 10,
    gap: 10,
    alignItems: "center",
  },
  cardWrapper: {
    width: "90%",
    marginBottom: 20,
    backgroundColor: "#f9f9f9", // Lighter background color
    padding: 10,
    borderRadius: 10,
    shadowColor: "gray",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.85,
    shadowRadius: 4,
    elevation: 4,
  },
  card: {
    aspectRatio: 1,
    backgroundColor: "#ffffff", // Lighter shade of white for the card
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4, // Adds shadow for Android
  },
  cardText: {
    color: "red", // A softer, more readable color
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

export default Main;
