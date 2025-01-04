import React, { useEffect, useState } from "react";
import Login from "@/components/LoginComponent";
import Registration from "@/components/RegistrationComponent";
import { Text, View, StyleSheet } from "react-native";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { AccessToken, LoginButton, Settings } from 'react-native-fbsdk-next';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@env";
const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);


  useEffect(() => {
    const requestTracking = async () => {
      const { status } = await requestTrackingPermissionsAsync();

      Settings.initializeSDK();

      if (status === "granted") {
        await Settings.setAdvertiserTrackingEnabled(true);
      }

    }
    requestTracking();
  }, []);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const sendFacebookAccessTokenToBackend = async (accessToken: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}user/facebooklogin/`, {
        access_token: accessToken,
      });
      console.log("Backend Response:", response.data);

      // JWT ტოკენი შეგიძლიათ AsyncStorage-ში შეინახოთ
      const { jwt_token } = response.data;
      console.log("JWT Token:", jwt_token);
      await AsyncStorage.setItem("jwt_token", jwt_token);
    } catch (error) {
      console.error("Error sending access token to backend:", error);
    }
  };

  return (
    <View style={styles.container}>

      {isLogin ? (
        <Login onSwitch={toggleAuthMode} />
      ) : (
        <Registration onSwitch={toggleAuthMode} />
      )}
      <LoginButton
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "white"
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },

  switch: {
    marginTop: 10,
  },
});

export default AuthScreen;
