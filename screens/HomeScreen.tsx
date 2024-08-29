import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
};
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;
type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View>
      <Text>Homepage KROSS Georgia!</Text>
    </View>
  );
};
export default HomeScreen;
