import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import Main from "./Main";
import Contact from "../components/Contact";
import MyPage from "../components/MyPage";

type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState<string>("Main");
  const [filter, setFilter] = useState<string>(""); // State for the filter input

  const renderContent = () => {
    switch (selectedTab) {
      case "Main":
        return <Main navigation={navigation} filter={filter} />; // Pass the filter to Main component
      case "MyPage":
        return <MyPage />;
      case "Contact":
        return <Contact />;
      default:
        return <Main navigation={navigation} filter={filter} />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KROSSGeorgia</Text>
      <TextInput
        style={styles.input}
        placeholder="რას ეძებ?"
        placeholderTextColor="#888"
        value={filter}
        onChangeText={setFilter} // Update the filter state
      />
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
          onPress={() => setSelectedTab("MyPage")}>
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
    paddingTop: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    color: "#2c3e50",
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
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "black",
  },
  tabText: {
    fontSize: 16,
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
