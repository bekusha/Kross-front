import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useAuth } from "@/context/authContext";
import { useOil } from "@/context/oilContext";
import { CommonActions, NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/routes";
import Icon from "react-native-vector-icons/MaterialIcons";
import Cart from "@/components/Cart";

const MyPageScreen: React.FC = () => {
  type MyPageScreenNavigationProp = NavigationProp<RootStackParamList, "Home">;

  const { user, logout, isLoggedIn } = useAuth();
  const { oilRecords, loading, error, fetchOilRecords, createOilRecord } =
    useOil();
  const [mileage, setMileage] = useState<string>(""); // State to store mileage input
  const [activeComponent, setActiveComponent] =
    useState<string>("ჩემი პროდუქტი"); // State to manage active component
  const navigation = useNavigation<MyPageScreenNavigationProp>();

  useEffect(() => {
    if (!isLoggedIn) {
      navigation.navigate("AuthScreen");
    } else {
      fetchOilRecords();
    }
  }, [isLoggedIn, navigation]);

  const handleSaveMileage = () => {
    if (mileage) {
      // Create a new oil record
      createOilRecord(parseInt(mileage, 10));
      setMileage("");
      fetchOilRecords();
      Alert.alert(
        "Mileage Saved",
        `Your oil change mileage is set to ${mileage} km.`
      );
    } else {
      Alert.alert("Error", "Please enter a valid mileage.");
    }
  };

  const handleLogOut = () => {
    // ნავიგაციის ისტორიის გასუფთავება და AuthScreen-ზე გადამისამართება
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Home" }],
      })
    );
    logout(); // ანალოგიურად, ლოგაუთის ფუნქციის გამოძახება
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
        <Icon name="logout" size={24} color="black" />
        <Text style={styles.logoutButtonText}>ექაუნთიდან გასვლა</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          მოგესალმები <span style={styles.username}> {user?.username}</span>{" "}
        </Text>

        {/* Add buttons for switching components */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeComponent === "ჩემი პროდუქტი" && styles.activeButton,
            ]}
            onPress={() => setActiveComponent("ჩემი პროდუქტი")}>
            <Text
              style={[
                styles.toggleButtonText,
                activeComponent === "ჩემი პროდუქტი" && styles.activeButtonText,
              ]}>
              პროდუქტი
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeComponent === "შენახული გარბენი" && styles.activeButton,
            ]}
            onPress={() => setActiveComponent("შენახული გარბენი")}>
            <Text
              style={[
                styles.toggleButtonText,
                activeComponent === "შენახული გარბენი" &&
                  styles.activeButtonText,
              ]}>
              გარბენი
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conditional rendering of components */}
        {activeComponent === "ჩემი პროდუქტი" && <Cart />}
        {activeComponent === "შენახული გარბენი" && (
          <View>
            <TextInput
              style={styles.input}
              placeholder="ჩაწერეთ გარბენი"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={mileage}
              onChangeText={setMileage}
            />
            <TouchableOpacity style={styles.button} onPress={handleSaveMileage}>
              <Text style={styles.buttonText}>შენახვა</Text>
            </TouchableOpacity>
            {oilRecords.length > 0 && (
              <View>
                <Text style={styles.savedText}>
                  შემდეგი შეცვლა: {oilRecords[0].next_change_mileage} km
                </Text>
                <Text style={styles.savedText}>
                  ძველი შეცვლა: {oilRecords[0].current_mileage} km
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  username: {
    color: "red",
  },
  logoutButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 10,
    right: 0,
    zIndex: 1,
  },
  logoutButtonText: {},
  card: {
    width: "100%",
    height: 500,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    marginTop: 130,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    width: 130,
    backgroundColor: "#ecf0f1",
    borderRadius: 8,
    marginHorizontal: 5,
    height: 40,
  },
  activeButton: {
    backgroundColor: "black",
  },
  toggleButtonText: {
    textAlign: "center",
    fontWeight: 400,
    color: "black",
    fontSize: 14,
  },
  activeButtonText: {
    color: "red",
  },
  input: {
    width: "100%",
    height: 44,
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  savedText: {
    marginTop: 20,
    fontSize: 14,
    width: "100%",
    color: "#2c3e50",
  },
});

export default MyPageScreen;
