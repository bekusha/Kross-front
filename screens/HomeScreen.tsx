import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import Main from "./Main";
import MyPageScreen from "./MyPageScreen";
import ContactScreen from "./ContactScreen";
import { useAuth } from "@/context/authContext"; // Ensure the correct path to your AuthContext

type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  AuthScreen: undefined; // Add AuthScreen to your RootStackParamList
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState<string>("Main");
  const [filter, setFilter] = useState<string>("");
  const { isLoggedIn } = useAuth();

  const handleMyPagePress = () => {
    console.log(isLoggedIn);
    if (isLoggedIn) {
      setSelectedTab("MyPage");
      console.log(isLoggedIn);
    } else {
      navigation.navigate("AuthScreen");
    }
  };
  const renderContent = () => {
    switch (selectedTab) {
      case "Main":
        return <Main navigation={navigation} />;
      case "MyPage":
        return <MyPageScreen />;
      case "Contact":
        return <ContactScreen />;
      default:
        return <Main navigation={navigation} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.logoContainer}><Image
        source={require("../assets/logo.jpg")}
        style={styles.logo}
        resizeMode="contain"  // ეს საშუალებას აძლევს სურათს შეინარჩუნოს პროპორცია
      /></View> */}

      {/* <Text style={styles.title}>KROSSGEORGIA</Text> */}
      {/* <TextInput
        style={styles.input}
        placeholder="რას ეძებ?"
        placeholderTextColor="#888"
        value={filter}
        onChangeText={setFilter}
      /> */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "Main" && styles.activeTab]}
          onPress={() => setSelectedTab("Main")}>
          <Text
            style={[
              styles.tabText,
              selectedTab === "Main" && styles.activeTabText,
            ]}>
            მთავარი
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "MyPage" && styles.activeTab]}
          onPress={handleMyPagePress} // Use the handleMyPagePress function here
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "MyPage" && styles.activeTabText,
            ]}>
            ჩემი გვერდი
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "Contact" && styles.activeTab]}
          onPress={() => setSelectedTab("Contact")}>
          <Text
            style={[
              styles.tabText,
              selectedTab === "Contact" && styles.activeTabText,
            ]}>
            კონტაქტი
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "red"
  },
  logo: {
    width: 150, // სურათის ფიქსირებული სიგანე
    height: 50, // სურათის ფიქსირებული სიმაღლე
    resizeMode: "contain", // სურათი ჩაჯდება კონტეინერში პროპორციების დაცვით
  },
  input: {
    height: 44,
    marginHorizontal: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#ecf0f1",
    borderTopWidth: 1,
    borderColor: "#dcdcdc",
  },
  tab: {
    paddingVertical: 12,
    // paddingHorizontal: 10,
    borderRadius: 10,
    width: 130,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "black",
    width: 130,
  },
  tabText: {
    fontSize: 14,
    color: "#2c3e50",
    fontWeight: "500",
  },
  activeTabText: {
    color: "red",
    fontWeight: "400",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
});


export default HomeScreen;