import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";

const Main = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        <Text style={styles.cardText}>გაესაუბრე KROSSGeorgia -ს ბოტს</Text>
        <TouchableOpacity style={styles.card}>
          <Image
            style={styles.image}
            source={require("../assets/aikrossbot.webp")}
          />
        </TouchableOpacity>
        <Text style={styles.cardText}>ძრავის ზეთები</Text>
        <TouchableOpacity style={styles.card}>
          <Image
            style={styles.image}
            source={require("../assets/engine.webp")}
          />
        </TouchableOpacity>
        <Text style={styles.cardText}>გადაცემათა კოლოფის ზეთები</Text>
        <TouchableOpacity style={styles.card}>
          <Image
            style={styles.image}
            source={require("../assets/gearbox.webp")}
          />
        </TouchableOpacity>
        <Text style={styles.cardText}>საწმენდი & მოვლის საშუალებები</Text>
        <TouchableOpacity style={styles.card}>
          <Image
            style={styles.image}
            source={require("../assets/cleaning.webp")}
          />
        </TouchableOpacity>
        <Text style={styles.cardText}>ყველა პროდუქტი</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Products")}
          style={styles.card}>
          <Image style={styles.image} source={require("../assets/shop.webp")} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Make the parent container fill the available screen height
  },
  cardContainer: {
    padding: 10,
    gap: 10,
    alignItems: "center", // Center content horizontally
  },
  card: {
    width: "90%", // Adjust width to fit better within the scrollable area
    aspectRatio: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  cardText: {
    color: "red",
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    marginVertical: 10, // Add spacing around text
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain", // Ensure the image fits within its container
  },
});

export default Main;
