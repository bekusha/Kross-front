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
import axios from "axios";
import { API_BASE_URL } from "@env";

type MainProps = {
  navigation: any;
};

const Main: React.FC<MainProps> = ({ navigation }) => {
  const { categories } = useProducts(); // Use the categories from context
  const { isLoggedIn } = useAuth();
  const [content, setContent] = useState<any[]>([]);


  useEffect(() => {
    // Fetch data from the backend using Axios
    axios
      .get(`${API_BASE_URL}content/main/`)
      .then((response) => {
        const formattedContent = response.data.map((item: any) => ({
          text: item.title,
          image: { uri: item.image }, // Assuming the backend returns the full image URL
          action: () => {
            // Find the category based on the title
            const category = categories.find((cat) => cat.name === item.title);
            if (category) {
              navigation.navigate("Products", { categoryId: category.id }); // Use fetched category ID
            } else if (item.action === "oil-change") {
              navigation.navigate("OilChangeScreen");
            } else if (item.action === "chat") {
              navigation.navigate("ChatScreen");
            } else if (item.title === "ყველა პროდუქტი") {
              navigation.navigate("Products", { categoryId: null }); // Pass null for all products
            }
          },
        }));
        setContent(formattedContent);
      })
      .catch((error: any) => {
        console.error("Error fetching data: ", error);
      });
  }, [categories]);


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
    shadowRadius: 2,
    elevation: 2,
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