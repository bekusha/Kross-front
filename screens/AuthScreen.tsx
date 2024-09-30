import React, { useState } from "react";
import Login from "@/components/LoginComponent";
import Registration from "@/components/RegistrationComponent";
import { Text, View, StyleSheet } from "react-native";

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <View style={styles.container}>

      {isLogin ? (
        <Login onSwitch={toggleAuthMode} />
      ) : (
        <Registration onSwitch={toggleAuthMode} />
      )}
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
