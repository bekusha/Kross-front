import React, { useEffect, useState } from "react";
import Login from "@/components/LoginComponent";
import Registration from "@/components/RegistrationComponent";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
// import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
// import { AccessToken, LoginButton, Settings } from 'react-native-fbsdk-next';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@env";
import { useAuth } from "@/context/authContext";
import { useNavigation, CommonActions } from "@react-navigation/native";

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  // const { loadUserDetails } = useAuth();
  const navigation = useNavigation();

  // useEffect(() => {
  //   const requestTracking = async () => {
  //     const { status } = await requestTrackingPermissionsAsync();
  //     Settings.initializeSDK();

  //     if (status === "granted") {
  //       await Settings.setAdvertiserTrackingEnabled(true);
  //     }
  //   };
  //   requestTracking();
  // }, []);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  // const sendFacebookAccessTokenToBackend = async (accessToken: any) => {
  //   setLoading(true); // ლოდინის დაწყება
  //   try {
  //     const response = await axios.post(`${API_BASE_URL}user/facebooklogin/`, {
  //       access_token: accessToken,
  //     });
  //     console.log("Backend Response:", response.data);

  //     const access = response.data.tokens?.access;
  //     const refresh = response.data.tokens?.refresh;

  //     if (access) {
  //       await AsyncStorage.setItem("access", access);
  //       await AsyncStorage.setItem("refresh", refresh);
  //       // await loadUserDetails(access);

  //       // ნავიგაცია მთავარ გვერდზე
  //       navigation.dispatch(
  //         CommonActions.reset({
  //           index: 0,
  //           routes: [{ name: "Home" }],
  //         })
  //       );
  //     } else {
  //       console.error("Access or Refresh token is undefined.");
  //     }
  //   } catch (error) {
  //     console.error("Error sending access token to backend:", error);
  //   } finally {
  //     setLoading(false); // ლოდინის დასრულება
  //   }
  // };

  if (loading) {
    // ლოდინის მდგომარეობა
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLogin ? (
        <Login onSwitch={toggleAuthMode} />
      ) : (
        <Registration onSwitch={toggleAuthMode} />
      )}
      {/* <LoginButton
        onLogoutFinished={() => console.log("logout")}
        onLoginFinished={(error, result) => {
          if (error) {
            console.error("Login failed with error: ", error);
          } else if (result.isCancelled) {
            console.log("Login was cancelled");
          } else {
            AccessToken.getCurrentAccessToken().then((data) => {
              if (data) {
                console.log("Facebook Access Token:", data.accessToken);
                sendFacebookAccessTokenToBackend(data.accessToken);
              }
            });
          }
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "gray",
  },
});

export default AuthScreen;
