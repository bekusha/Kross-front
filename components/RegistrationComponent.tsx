import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { useAuth } from "@/context/authContext";
import * as Animatable from "react-native-animatable";
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
        const success = await authContext.register(
          email,
          username,
          password,
          confirmPassword,
          role
        );
        if (success) {
          setSuccess(true);
          setError("");
        } else {
          setError(
            "რეგისტრაციის დროს მოხდა შეცდომა, ან ასეთი მომხმარებელი უკვე არსებობს"
          );
        }
      } catch (error) {
        console.error(error);
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Animatable.View
        animation="fadeInDown"
        duration={800}
        easing="ease-in-out"
        style={styles.formContainer}
      >
        <Text style={styles.title}>რეგისტრაცია</Text>

        {success ? (
          <Text style={styles.successMessage}>
            რეგისტრაცია წარმატებით გაიარეთ, შეგიძლიათ შეხვიდეთ სისტემაში.
          </Text>
        ) : (
          <>
            <Animatable.View
              animation="fadeInUp"
              duration={600}
              delay={300}
              easing="ease-in-out"
            >
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                placeholderTextColor="#666"
              />
            </Animatable.View>

            <Animatable.View
              animation="fadeInUp"
              duration={600}
              delay={500}
              easing="ease-in-out"
            >
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

            <Animatable.View
              animation="fadeInUp"
              duration={600}
              delay={700}
              easing="ease-in-out"
            >
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                autoCapitalize="none"
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#666"
              />
            </Animatable.View>

            <Animatable.View
              animation="fadeInUp"
              duration={600}
              delay={900}
              easing="ease-in-out"
            >
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                autoCapitalize="none"
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor="#666"
              />
            </Animatable.View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Animatable.View
              animation="fadeInUp"
              duration={600}
              delay={1100}
              easing="ease-in-out"
            >
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>რეგისტრაცია</Text>
              </TouchableOpacity>
            </Animatable.View>
          </>
        )}

        <Animatable.View
          animation="fadeInUp"
          duration={600}
          delay={1300}
          easing="ease-in-out"
        >
          <TouchableOpacity onPress={onSwitch} style={styles.switchButton}>
            <Text style={styles.switchText}>
              თუ რეგისტრაცია გავლილი გაქვთ შეგიძლიათ შეხვიდეთ თქვენს ექაუნთზე
            </Text>
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
  successMessage: {
    color: "green",
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
  buttonText: {
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

export default Registration;
