import React, { useState, useCallback, useLayoutEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useAuth } from "@/context/authContext";

const Header: React.FC = () => {
  const navigation = useNavigation();
  const { isLoggedIn } = useAuth();
  const [selectedTab, setSelectedTab] = useState<string>("Main");
  const isFocused = useIsFocused();

  const handleNavigation = useCallback(
    (screen: string) => {
      if (screen !== selectedTab) {
        setSelectedTab(screen);
        navigation.navigate(screen as never);
      }
    },
    [navigation, selectedTab]
  );

  useLayoutEffect(() => {
    if (isFocused) {
      // შემოწმება რომ getState არ არის undefined
      const state = navigation.getState();
      if (state) {
        const currentRouteName = state.routes[state.index]?.name;
        if (currentRouteName) {
          setSelectedTab(currentRouteName);
        }
      }
    }
  }, [isFocused, navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>KROSSGEORGIA</Text>
        <View style={styles.tabContainer}>
          {["Main", "MyPageScreen", "ContactScreen"].map((screen) => (
            <TouchableOpacity
              key={screen}
              style={[styles.tab, selectedTab === screen && styles.activeTab]}
              onPress={() => handleNavigation(screen)}>
              <Text
                style={[
                  styles.tabText,
                  selectedTab === screen && styles.activeTabText,
                ]}>
                {screen === "Main"
                  ? "მთავარი"
                  : screen === "MyPageScreen"
                    ? "ჩემი გვერდი"
                    : screen === "ContactScreen"
                      ? "კონტაქტი"
                      : ""}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  container: {
    paddingTop: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "red",
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
    fontWeight: "500",
  },
});

export default Header;
