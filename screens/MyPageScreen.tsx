// MyPageScreen.tsx
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
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/routes";

const MyPageScreen: React.FC = () => {
  type MyPageScreenNavigationProp = NavigationProp<RootStackParamList, "Home">;

  const { user, logout } = useAuth();
  const { oilRecords, loading, error, fetchOilRecords, createOilRecord } =
    useOil();
  const [mileage, setMileage] = useState<string>(""); // State to store mileage input
  const [savedMileage, setSavedMileage] = useState<string | null>(null); // State to store saved mileage
  const navigation = useNavigation<MyPageScreenNavigationProp>();

  useEffect(() => {
    fetchOilRecords();
  }, []);

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
    navigation.navigate("Home");
    logout();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogOut}>
        <Text>გასვლა</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>მოგესალმები {user?.username} </Text>

        <TextInput
          style={styles.input}
          placeholder="ჩაწერეთ გარბენი"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={mileage}
          onChangeText={setMileage}
        />
        <TouchableOpacity style={styles.button} onPress={handleSaveMileage}>
          <Text onPress={handleSaveMileage} style={styles.buttonText}>
            შენახვა
          </Text>
        </TouchableOpacity>
        {oilRecords.length > 0 && (
          <View>
            <Text style={styles.savedText}>
              {" "}
              შემდეგი შეცვლა: {oilRecords[0].next_change_mileage} km
            </Text>
            <Text style={styles.savedText}>
              ძველი შეცვლა {oilRecords[0].current_mileage} km
            </Text>
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
    fontSize: 14,
    width: "100%",
    color: "#2c3e50",
  },
});

export default MyPageScreen;
