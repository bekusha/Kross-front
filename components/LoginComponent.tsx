import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
} from "react-native";
import { useAuth } from "@/context/authContext";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";

interface LoginProps {
  onSwitch: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitch }) => {
  const { login } = useAuth() || {};
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setHidden(true, 'slide'); // Hide the StatusBar on iOS
    }
    return () => {
      StatusBar.setHidden(false, 'slide'); // Revert to default when component unmounts
    };
  }, []);

  const handleSubmit = async () => {
    if (login) {
      setLoading(true);
      const success = await login(username, password);
      if (success) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Home" }],
          })
        );
      } else {
        setError("Login failed. Please check your credentials.");
      }
      setLoading(false);
    } else {
      setError("Authentication service is not available.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Animatable.View animation="fadeInDown" duration={800} easing="ease-in-out" style={styles.formContainer}>
        <Text style={styles.title}>სისტემაში შესვლა</Text>

        <Animatable.View animation="fadeInUp" duration={600} delay={300} easing="ease-in-out">
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="username"
            placeholderTextColor="#666"
          />
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={600} delay={500} easing="ease-in-out">
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#666"
          />
        </Animatable.View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Animatable.View animation="fadeInUp" duration={600} delay={700} easing="ease-in-out">
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonLoading]}
            onPress={handleSubmit}
          >
            <Text style={loading ? styles.buttonTextLoading : styles.buttonText}>
              {loading ? "Loading..." : "შესვლა"}
            </Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={600} delay={900} easing="ease-in-out">
          <TouchableOpacity onPress={onSwitch} style={styles.switchButton}>
            <Text style={styles.switchText}>არ გაქვთ პროფილი? გაიარეთ რეგისტრაცია</Text>
          </TouchableOpacity>
        </Animatable.View>
      </Animatable.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    top: -60,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  formContainer: {
    width: "90%",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#f9f9f9",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#D32F2F",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "100%",
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "black",
    borderWidth: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonLoading: {
    backgroundColor: "balck",
  },
  buttonText: {
    color: "#D32F2F",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonTextLoading: {
    color: "#D32F2F",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchButton: {
    marginTop: 10,
    alignItems: "center",
  },
  switchText: {
    color: "#D32F2F",
    textAlign: "center",
  },
});

export default Login;
