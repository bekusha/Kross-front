import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Dimensions,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import Main from "./Main";
import MyPageScreen from "./MyPageScreen";
import ContactScreen from "./ContactScreen";
import { useAuth } from "@/context/authContext"; // Ensure the correct path to your AuthContext
import { LinearGradient } from "expo-linear-gradient"; // Make sure to install expo-linear-gradient

type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  AuthScreen: undefined; // Add AuthScreen to your RootStackParamList
};

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const tabs = [
  { id: "Main", text: "მთავარი" },
  { id: "MyPage", text: "  ჩემი გვერდი" },
  { id: "Contact", text: "კონტაქტი" }
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState<string>("Main");
  const { isLoggedIn } = useAuth();

  // Add animation values for each tab
  const [mainScale] = useState(new Animated.Value(1));
  const [myPageScale] = useState(new Animated.Value(1));
  const [contactScale] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));

  // Add new state for screen dimensions
  const [tabWidth, setTabWidth] = useState(100);


  React.useEffect(() => {
    const { width } = Dimensions.get('window');
    const padding = 40; 
    const spacing = 10; 
    const numberOfTabs = 3;
    const calculatedWidth = (width - padding - (spacing * (numberOfTabs - 1))) / numberOfTabs;
    setTabWidth(Math.max(90, Math.min(calculatedWidth, 120))); 
  }, []);

  // ანიმაციის ფუნქცია მოქმედების დროს
  const animatePress = (animatedValue: Animated.Value) => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  React.useEffect(() => {
    let toValue = 0;
    switch (selectedTab) {
      case "Main":
        toValue = Platform.select({ ios: 5, android: 5 }) ?? 15;
        break;
      case "MyPage":
        toValue = Platform.select({ 
          ios: (tabWidth) + 6, 
          android: (tabWidth) + 11
        }) ?? (tabWidth ) + 1;
        break;
      case "Contact":
        toValue = Platform.select({ 
          ios: (tabWidth * 2) + 10, 
          android: (tabWidth * 2) + 15 
        }) ?? (tabWidth * 2) + 15;
        break;
    }

    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 50,
    }).start();
  }, [selectedTab, tabWidth]);

  const handleMyPagePress = () => {
    if (isLoggedIn) {
      setSelectedTab("MyPage");
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
      <LinearGradient
        colors={["#ffffff", "#ffffff"]} // Corrected colors
        style={[
          styles.gradient,
          Platform.OS === "android" && { backgroundColor: "#ffffff" }, // Ensure white background for Android
        ]}
        start={{ x: 2, y: 0 }}
        end={{ x: 1, y: 2 }}
      >
        <View style={styles.tabContainer}>
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                transform: [{ translateX: slideAnim }],
                width: tabWidth,
              },
            ]}
          />
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, selectedTab === tab.id && styles.activeTab]}
              onPress={() => {
                setSelectedTab(tab.id);
                animatePress(mainScale);
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab.id && styles.activeTabText,
                ]}
                adjustsFontSizeToFit={true}
                numberOfLines={1}
              >
                {tab.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
      <View style={styles.contentContainer}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gradient: {
    paddingTop: 8,
    backgroundColor: Platform.OS === "ios" ? "#ffffff" : "transparent",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 30,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.2)",
    position: "relative",
    shadowColor: "rgba(255, 59, 48, 0.3)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  tabIndicator: {
    position: "absolute",
    bottom: 6,
    left: 15,
    height: 4,
    backgroundColor: "#ff3b30",
    borderRadius: 3,
    alignSelf: "center",
    shadowColor: "#ff3b30",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 25,
    minWidth: 90,
    maxWidth: 120,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    flex: 1,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: "rgba(255, 59, 48, 0.15)",
    shadowColor: "#ff3b30",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  tabText: {
    fontSize: Platform.OS === 'ios' ? 15 : 14,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
    textAlign: "center",
  },
  activeTabText: {
    color: "#ff3b30",
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default HomeScreen;


