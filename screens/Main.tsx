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
  Platform,
} from "react-native";
import { useProducts } from "../context/productContext";
import { useAuth } from "@/context/authContext";
import axios from "axios";
import { API_BASE_URL } from "@env";
import Footer from "@/components/Footer";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

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
          <TouchableOpacity 
            key={index} 
            style={styles.cardWrapper}
            onPress={item.action}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.7)', 'transparent']}
              style={styles.gradient}
            >
              <Text style={styles.cardText}>{item.text}</Text>
            </LinearGradient>
            <Image 
              style={styles.image} 
              source={item.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
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
    paddingHorizontal: 15,
    paddingBottom: 100,
    paddingTop: 15,
    gap: 15,
    alignItems: 'center',
  },
  cardWrapper: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    zIndex: 1,
    justifyContent: 'flex-start',
    padding: 20,
  },
  cardText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});

export default Main;
