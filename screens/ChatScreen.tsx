// ChatScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAI } from "@/context/aiContext";

const ChatScreen = () => {
  const { aiResponses, loading, error, fetchAIResponse } = useAI();
  const [input, setInput] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
    handleShowMessage;
  }, [aiResponses]);

  const handleSend = () => {
    if (input.trim()) {
      fetchAIResponse(input); // Fetch bot response, do not save user message
      setInput("");
    }
  };

  const handleShowMessage = () => {
    if (!aiResponses) {
      setShowMessage(!showMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      {error && <Text style={styles.error}>Error: {error}</Text>}
      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      )}
      <FlatList
        ref={flatListRef}
        data={aiResponses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.botResponseCard}>
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
        )}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        showsVerticalScrollIndicator={false} // Hide scroll indicator for better UX
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="მარკა, მოდელი, ძრავი, წელი"
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>მიიღე ინფორმაცია</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  chatContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#0084ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  botResponseCard: {
    backgroundColor: "#e1e1e1",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    alignSelf: "center",
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 16,
  },
  loadingIndicator: {
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});

export default ChatScreen;
