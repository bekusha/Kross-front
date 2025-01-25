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
// import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

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
    // Alert.alert(
    //   "ექაუნთიდან გასვლა",
    //   "ნამდვილად გსურთ ექაუნთიდან გასვლა?",
    //   [
    //     {
    //       text: "არა",
    //       style: "cancel",
    //     },
    //     {
    //       text: "დიახ",
    //       onPress: async () => {
    //         // Facebook-იდან გამოსვლა
    //         try {
    //           const currentAccessToken = await AccessToken.getCurrentAccessToken();
    //           if (currentAccessToken) {
    //             LoginManager.logOut();
    //             console.log("Facebook logged out");
    //           }
    //         } catch (error) {
    //           console.error("Facebook logout error:", error);
    //         }

    //         // აპლიკაციიდან გამოსვლა
    //         logout();
    //         navigation.dispatch(
    //           CommonActions.reset({
    //             index: 0,
    //             routes: [{ name: "AuthScreen" }], // გადაყვანა ავტორიზაციის გვერდზე
    //           })
    //         );
    //       },
    //     },
    //   ],
    //   { cancelable: false }
    // );
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
            <Icon name="logout" size={24} color="#FF3B30" />
            <Text style={styles.logoutButtonText}>ექაუნთიდან გასვლა</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.username}>
              {user?.username ? capitalizeFirstLetter(user.username) : "User"}
              <Text style={styles.pageText}>'s Page</Text>
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.settingsButton} 
            onPress={() => setShowSettings(!showSettings)}
          >
            <Icon name="settings" size={24} color="#ffffff" />
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

        <View style={styles.contentContainer}>
          {activeComponent === "ჩემი პროდუქტი" && <Cart />}
          {activeComponent === "შენახული გარბენი" && (
            <View style={styles.mileageContainer}>
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
                <View style={styles.recordsContainer}>
                  <View style={styles.recordItem}>
                    <Icon name="trending-up" size={20} color="#4CAF50" />
                    <Text style={styles.savedText}>
                      შემდეგი შეცვლა: {oilRecords[0].next_change_mileage} km
                    </Text>
                  </View>
                  <View style={styles.recordItem}>
                    <Icon name="history" size={20} color="#FF9800" />
                    <Text style={styles.savedText}>
                      ძველი შეცვლა: {oilRecords[0].current_mileage} km
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  card: {
    width: "100%",
    minHeight: 500,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 5,
   
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#1a1a1a',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    
  },
  pageText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '400',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#ffffff',
  },
  toggleButton: {
    flex: 1,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  activeButton: {
    backgroundColor: '#FF3B30',
  },
  toggleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  activeButtonText: {
    color: '#ffffff',
  },
  contentContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  mileageContainer: {
    alignItems: 'center',
    padding: 16,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  recordsContainer: {
    width: '100%',
    gap: 12,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  savedText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
  },
  settingsPopup: {
    position: 'absolute',
    top: 80,
    right: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 8,
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default MyPageScreen;
