import React, { useEffect, useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useProducts } from "../context/productContext";
import { useAuth } from "@/context/authContext";
import axios from "axios";
import { API_BASE_URL } from "@env";
import Footer from "@/components/Footer";



const { width } = Dimensions.get('window');
const cardWidth = width - 20;

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
        setContent(formattedContent);
      })
      .catch((error: any) => {
        console.error("Error fetching data: ", error);
      });
  }, [categories]);

  if (!content.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.cardContainer}
        showsVerticalScrollIndicator={false}
      >
        {content.map((item, index) => (
          <View key={index} style={styles.shadowContainer}>
            <TouchableOpacity 
              style={styles.cardWrapper}
              onPress={item.action}
              activeOpacity={0.9}
            >
              <View style={styles.overlay}>
                <Text style={styles.cardText}>{item.text}</Text>
              </View>
              <Image 
                style={styles.image} 
                source={item.image}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Footer/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  cardContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 20,
  },
  shadowContainer: {
    width: cardWidth,
    marginHorizontal: 10,
    transform: [
      { scaleX: 0.95 }
    ],
    shadowColor: 'red',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cardWrapper: {
    width: '100%',
    height: 300,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    borderRadius: 30,
    justifyContent: 'flex-start',
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  cardText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default Main;