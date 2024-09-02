// MyPageScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useAuth } from "@/context/authContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/routes";

const MyPageScreen: React.FC = () => {
  type MyPageScreenNavigationProp = NavigationProp<RootStackParamList, "Home">;

  const { user, logout } = useAuth();
  const [mileage, setMileage] = useState<string>(""); // State to store mileage input
  const [savedMileage, setSavedMileage] = useState<string | null>(null); // State to store saved mileage
  const navigation = useNavigation<MyPageScreenNavigationProp>();

  const handleSaveMileage = () => {
    if (mileage) {
      setSavedMileage(mileage);
      Alert.alert(
        "Mileage Saved",
        `Your oil change mileage is set to ${mileage} km.`
      );
    } else {
      Alert.alert("Error", "Please enter a valid mileage.");
    }
  };

  const handleLogOut = () => {
    logout();
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogOut}>
        <Text>გასვლა</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>მოგესალმები {user?.username} </Text>
        <Text style={styles.cardTitle}>
          ზეთის შეცვლის დროს, არსებული გარბენი
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter oil change mileage"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={mileage}
          onChangeText={setMileage}
        />
        <TouchableOpacity style={styles.button} onPress={handleSaveMileage}>
          <Text style={styles.buttonText}>შენახვა</Text>
        </TouchableOpacity>
        {savedMileage && (
          <Text style={styles.savedText}>
            წინა ზეთის შეცვლის გარბენი: {savedMileage} km
          </Text>
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
  },
  card: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
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
    color: "#2c3e50",
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
    fontSize: 16,
    color: "#2c3e50",
  },
});

export default MyPageScreen;
