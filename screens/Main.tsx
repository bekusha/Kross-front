import React, { useEffect, useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,

} from "react-native";
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from "../context/productContext";
import { useAuth } from "@/context/authContext";
import axios from "axios";
import { API_BASE_URL } from "@env";
// import Footer from "@/components/Footer";




type MainProps = {
  navigation: any;
};
const Main: React.FC<MainProps> = ({ navigation }) => {
  const { categories } = useProducts();
  const { isLoggedIn } = useAuth();
  const [content, setContent] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}content/main/`)
      .then((response) => {
        const formattedContent = response.data.map((item: any) => ({
          text: item.title,
          image: { uri: item.image },
          action: () => {
            const category = categories.find((cat) => cat.name === item.title);
            if (category) {
              navigation.navigate("Products", { categoryId: category.id });
            } else if (item.action === "oil-change") {
              navigation.navigate("OilChangeScreen");
            } else if (item.action === "chat") {
              navigation.navigate("ChatScreen");
            } else if (item.title === "ყველა პროდუქტი") {
              navigation.navigate("Products", { categoryId: null });
            }
          },
        }));
        formattedContent.sort((a: any, b: any) => (a.text.includes("შეარჩიე სწორი") ? -1 : 1));
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
          <View key={index} style={{ width: "90%", alignItems: "center" }}>
            {/* წარწერა ქარდის გარეთ */}
            <View style={styles.serviceHeader}>
              {(index === 0 || index === 1) && (
                <View style={styles.serviceHeader}>
                  {item.text.includes("შეარჩიე სწორი") ? (
                    <>
                      <Ionicons name="construct-outline" size={24} color="red" />
                      <Text style={styles.serviceHeaderText}>სერვის-ჯგუფის ადგილზე გამოძახება</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="cart-outline" size={24} color="green" />
                      <Text style={styles.serviceHeaderText}>მხოლოდ პროდუქციის გამოძახება</Text>
                    </>
                  )}
                </View>
              )}

            </View>

            <Animatable.View
              animation="fadeInDown"
              duration={600}
              delay={index * 150}
              easing="ease-out"
              useNativeDriver={true}
              style={styles.cardWrapper}
            >
              <Text style={styles.cardText}>{item.text}</Text>
              <View style={{ overflow: "hidden" }}>
                <Animatable.View
                  animation={{
                    0: { translateY: 200, opacity: 0 },
                    1: { translateY: 0, opacity: 1 },
                  }}
                  duration={700}
                  delay={index * 150 + 200}
                  easing="ease-out"
                  useNativeDriver={true}
                >
                  <TouchableOpacity
                    style={styles.card}
                    onPress={item.action}
                    activeOpacity={0.7}
                  >
                    <Image style={styles.image} source={item.image} />
                  </TouchableOpacity>
                </Animatable.View>
              </View>
            </Animatable.View>
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
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.85,
    shadowRadius: 2,
    elevation: 5,
  },
  card: {
    aspectRatio: 1,
    backgroundColor: "#ffffff", // Lighter shade of white for the card
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
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
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    gap: 10, // ხატულასა და ტექსტს შორის სივრცე
  },
  serviceHeaderText: {
    fontSize: 16,
    color: 'gray'
  },

});

export default Main;