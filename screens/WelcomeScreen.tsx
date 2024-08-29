import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
};

type WelcomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Welcome"
>;

type WelcomeScreenRouteProp = RouteProp<RootStackParamList, "Welcome">;

type Props = {
  navigation: WelcomeScreenNavigationProp;
};

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        მოგესალმებათ <span style={styles.redText}>KROSS</span> Georgia!
      </Text>
      <Text style={styles.smallText}>
        ჩვენს აპლიკაციაში არის გამოყენებული ხელოვნური ინტელექტი, რომელიც
        დაგეხმარებათ თქვენი ავტომობილისთვის სწორი პროდუქტის შერჩევაში
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}>
        <Text style={styles.button}>დაწყება</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  smallText: {
    width: 300,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "black",
    color: "red",
    display: "flex",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
  },

  redText: {
    color: "red",
  },
});

export default WelcomeScreen;
