import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { useAuth } from "@/context/authContext";
import { useNavigation } from "@react-navigation/native";
import { LoginScreenNavigationProp } from "@/types/routes";
import { CommonActions } from "@react-navigation/native";

interface LoginProps {
  onSwitch: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitch }) => {
  // const authContext = useAuth();
  const { user, login, isLoggedIn } = useAuth() || {};
  const [username, setUsername] = useState("");
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (login) {
      const success = await login(username, password);

      if (success) {
        // Navigate to MyPage after successful login
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Home" }]
          })
        )
      }

      console.log("User in component" + user?.username);
      if (!success) {
        setError("Login failed. Please check your credentials.");
      }
    } else {
      setError("Authentication service is not available.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.title}>სისტემაში შესვლა</Text>
      <TextInput
        style={styles.input}
        placeholder="username"
        value={username}
        onChangeText={setUsername}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="emailAddress"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity onPress={handleSubmit} ><Text>შესვლა</Text></TouchableOpacity>
      <TouchableOpacity onPress={onSwitch} style={styles.switchButton}>
        <Text style={styles.switchText}>
          არ გაქვთ პროფილი? გაიარეთ რეგისტრაცია
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",



  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#0066cc",
    padding: 10,
    borderRadius: 5,
  },
  switchButton: {
    marginTop: 10,
    alignItems: "center",
  },
  switchText: {
    color: "#0066cc",
    textDecorationLine: "underline",
  },
});

export default Login;
