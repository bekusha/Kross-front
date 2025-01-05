import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useAuth } from "@/context/authContext";
import { useOil } from "@/context/oilContext";
import { CommonActions, NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/routes";
import Icon from "react-native-vector-icons/MaterialIcons";
import Cart from "@/components/Cart";
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

const MyPageScreen: React.FC = () => {
  type MyPageScreenNavigationProp = NavigationProp<RootStackParamList, "Home">;

  const { user, logout, isLoggedIn } = useAuth();
  const { oilRecords, loading, error, fetchOilRecords, createOilRecord } = useOil();
  const [mileage, setMileage] = useState<string>("");
  const [activeComponent, setActiveComponent] = useState<string>("ჩემი პროდუქტი");
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const navigation = useNavigation<MyPageScreenNavigationProp>();

  useEffect(() => {
    if (!isLoggedIn && !user) {
      navigation.navigate("AuthScreen");
    } else {
      fetchOilRecords();
    }
  }, [isLoggedIn, navigation]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchOilRecords();
    }
  }, [isLoggedIn, mileage]);


  const capitalizeFirstLetter = (username: string) => {
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  const handleSaveMileage = () => {
    if (mileage) {
      createOilRecord(parseInt(mileage, 10));
      setMileage("");
      fetchOilRecords();
      Alert.alert("გარბენი შენახულია", `ზეთი შეიცვალა ${mileage} კმ გარბენზე.`);
    } else {
      Alert.alert("Error", "Please enter a valid mileage.");
    }
  };

  // const handleLogOut = () => {
  //   Alert.alert(
  //     "ექაუნთიდან გასვლა",
  //     "ნამდვილად გსურთ ექაუნთიდან გასვლა?",
  //     [
  //       {
  //         text: "არა",
  //         style: "cancel",
  //       },
  //       {
  //         text: "დიახ",
  //         onPress: () => {
  //           logout();
  //           navigation.dispatch(
  //             CommonActions.reset({
  //               index: 0,
  //               routes: [{ name: "Home" }], // გადაყვანა ავტორიზაციის გვერდზე ლოგაუთის შემდეგ
  //             })
  //           );
  //         },
  //       },
  //     ],
  //     { cancelable: false }
  //   );
  // };


  const handleLogOut = () => {
    Alert.alert(
      "ექაუნთიდან გასვლა",
      "ნამდვილად გსურთ ექაუნთიდან გასვლა?",
      [
        {
          text: "არა",
          style: "cancel",
        },
        {
          text: "დიახ",
          onPress: async () => {
            // Facebook-იდან გამოსვლა
            try {
              const currentAccessToken = await AccessToken.getCurrentAccessToken();
              if (currentAccessToken) {
                LoginManager.logOut();
                console.log("Facebook logged out");
              }
            } catch (error) {
              console.error("Facebook logout error:", error);
            }

            // აპლიკაციიდან გამოსვლა
            logout();
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "AuthScreen" }], // გადაყვანა ავტორიზაციის გვერდზე
              })
            );
          },
        },
      ],
      { cancelable: false }
    );
  };



  // const handleLogOut = () => {
  //   logout();
  //   // navigation.dispatch(
  //   //   CommonActions.reset({
  //   //     index: 0,
  //   //     routes: [{ name: "Home" }],
  //   //   })
  //   // );
  // };



  return (
    <View style={styles.container}>
      {showSettings && (
        <View style={[styles.settingsPopup, { zIndex: 10 }]}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
            <Icon name="logout" size={24} color="black" />
            <Text style={styles.logoutButtonText}>ექაუნთიდან  </Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <Text style={styles.username}>
            {user?.username
              ? capitalizeFirstLetter(user.username)
              : "User"}'s
          </Text>
          <Text>  Page</Text>
        </Text>

        <View style={styles.accountSettings}>
          <TouchableOpacity onPress={() => setShowSettings(!showSettings)}>
            <Icon name="settings" size={30} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, activeComponent === "ჩემი პროდუქტი" && styles.activeButton]}
            onPress={() => setActiveComponent("ჩემი პროდუქტი")}>
            <Text style={[styles.toggleButtonText, activeComponent === "ჩემი პროდუქტი" && styles.activeButtonText]}>
              პროდუქტი
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, activeComponent === "შენახული გარბენი" && styles.activeButton]}
            onPress={() => setActiveComponent("შენახული გარბენი")}>
            <Text style={[styles.toggleButtonText, activeComponent === "შენახული გარბენი" && styles.activeButtonText]}>
              გარბენი
            </Text>
          </TouchableOpacity>
        </View>

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
    elevation: (Platform.OS === 'android') ? 5 : 0,
  },
  accountButtons: {
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
    zIndex: 5,
  },
  logoutButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  deleteButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  logoutButtonText: {
    marginLeft: 10,
  },
  card: {
    width: "100%",
    height: 500,
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
    backgroundColor: "black",
  },
  toggleButtonText: {
    textAlign: "center",
    fontWeight: 400,
    color: "black",
    fontSize: 14,

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
