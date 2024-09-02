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
import axios from "axios";
import { API_BASE_URL } from "@env"; // Ensure that you have configured react-native-dotenv or similar
import { Role } from "@/types/user";

interface RegistrationProps {
  onSwitch: () => void;
}

const Registration: React.FC<RegistrationProps> = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>(Role.CONSUMER);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const authContext = useAuth();

  const handleSubmit = async () => {
    if (authContext) {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      try {
        const response = await authContext.register(
          email,
          username,
          password,
          confirmPassword,
          role
        );
        setSuccess(true);
        console.log(response);
      } catch (error) {
        console.error(error);
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      {success ? (
        <Text style={styles.successMessage}>
          Registration successful! You can now log in.
        </Text>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
          />
          <TextInput
            style={styles.input}
            placeholder="username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="username"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <Button
            title="Register as Admin"
            onPress={() => setRole(Role.ADMIN)}
          />
          <Button
            title="Register as Vendor"
            onPress={() => setRole(Role.VENDOR)}
          />
          <Button
            title="Register as Consumer"
            onPress={() => setRole(Role.CONSUMER)}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Register" onPress={handleSubmit} />
        </>
      )}
      <TouchableOpacity onPress={onSwitch} style={styles.switchButton}>
        <Text style={styles.switchText}>
          თუ რეგისტრაცია გავლილი გაქვთ შეგიძლიათ შეხვიდეთ თქვენს ექაუნთზე
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
  successMessage: {
    color: "green",
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

export default Registration;
