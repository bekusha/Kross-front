import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useAuth } from "@/context/authContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/routes";
import Icon from "react-native-vector-icons/MaterialIcons";
import Cart from "@/components/Cart";
import SavedOrders from "@/components/SavedOrders";

const MyPageScreen: React.FC = () => {
  type MyPageScreenNavigationProp = NavigationProp<RootStackParamList, "Home">;

  const { user, isLoggedIn } = useAuth();
  // const { fetchOilRecords, createOilRecord } = useOil();
  const [activeComponent, setActiveComponent] = useState<string>("ჩემი პროდუქტი");


  const capitalizeFirstLetter = (username: string) => {
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <Text style={styles.username}>
            {user?.username
              ? capitalizeFirstLetter(user.username)
              : "User"}'s
          </Text>
          <Text>  Page</Text>
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, activeComponent === "ჩემი პროდუქტი" && styles.activeButton]}
            onPress={() => setActiveComponent("ჩემი პროდუქტი")}>
            <Text style={[styles.toggleButtonText, activeComponent === "ჩემი პროდუქტი" && styles.activeButtonText]}>
              <Icon name="shopping-cart" size={20} color="auto" style={{ marginLeft: 10 }} />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, activeComponent === "შენახული გარბენი" && styles.activeButton]}
            onPress={() => setActiveComponent("შენახული გარბენი")}>
            <Text style={[styles.toggleButtonText, activeComponent === "შენახული გარბენი" && styles.activeButtonText]}>
              <Icon name="history" size={20} color="auto" style={{ marginLeft: 10 }} />
            </Text>
          </TouchableOpacity>
        </View>

        {activeComponent === "ჩემი პროდუქტი" && <Cart />}
        {activeComponent === "შენახული გარბენი" && (
          <SavedOrders />
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
  accountSettings: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  settingsPopup: {
    position: "absolute",
    zIndex: 5,
    top: 40, // Adjust this based on your needs
    right: 50,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,

  },
  accountButtons: {
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
    zIndex: 5,
  },

  deleteButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,

  },

  card: {
    width: "100%",
    height: "80%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    position: "absolute",
    top: 20,
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
    justifyContent: "center",
    width: 130,
    backgroundColor: "#ecf0f1",
    borderRadius: 8,
    marginHorizontal: 5,
    height: 40,

  },
  activeButton: {
    backgroundColor: "red",
  },
  toggleButtonText: {
    textAlign: "center",
    fontWeight: 400,
    color: "black",
    fontSize: 16,

  },
  activeButtonText: {
    color: "white",
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#ecf0f1",
    paddingVertical: 5,
    borderRadius: 10,

  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  savedText: {
    marginTop: 20,
    fontSize: 14,
    width: "100%",
    color: "#2c3e50",
    fontWeight: "bold",
  },
});

export default MyPageScreen;