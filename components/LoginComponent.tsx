import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useAuth } from "@/context/authContext";
import { useNavigation } from "@react-navigation/native";
import { LoginScreenNavigationProp } from "@/types/routes";

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
        navigation.navigate("MyPageScreen");
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
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
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
      <Button title="Login" onPress={handleSubmit} />
      <TouchableOpacity onPress={onSwitch} style={styles.switchButton}>
        <Text style={styles.switchText}>
          არ გაქვთ პროფილი? გაიარეთ რეგისტრაცია
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
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
