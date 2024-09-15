import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Button,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useOilChange } from "../context/OilChangeContext";
import { useProducts } from "@/context/productContext";
import { useAuth } from "@/context/authContext";

const OilChangeScreen = () => {
  const { deliveries, loading, error, fetchDeliveries, createDelivery } = useOilChange();
  const { products } = useProducts();
  const { user } = useAuth();

  // State for form inputs
  const [formData, setFormData] = useState({
    user: user || "",
    phone: user?.phone || "",
    address: user?.address || "",
    email: user?.email || "",
    product: "",
    message: "",
    ordered_at: '',
  });

  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetchDeliveries();
    
  }, []);

  useEffect(() => {
    console.log("User from context:", user);
  }, [user]);

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateDelivery = () => {
    if (!formData.phone || !formData.address || !formData.email || !formData.product) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    if (!user) {
      Alert.alert("Error", "User information is not available.");
      return;
    }

    const newDelivery = {
      user: user.id,
      phone: formData.phone,
      address: formData.address,
      email: formData.email,
      product: Number(formData.product),
      message: formData.message,
      ordered_at: '',
    };

    createDelivery(newDelivery)
      .then(() => {
        Alert.alert("Success", "Delivery created successfully.");
        setFormData((prevFormData) => ({
          ...prevFormData,
          phone: "",
          address: "",
          email: "",
          message: "",
          ordered_at: '',
        }));
      })
      .catch((err) => Alert.alert("Error", err.message));
  };

  const toggleExpand = (id: number) => {
    setExpanded(expanded === id ? null : id);
    console.log("Deliveries from changescreen:", deliveries);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button title="Retry" onPress={fetchDeliveries} color="#ff6347" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text>Welcome, {user?.username}</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="Phone"
          value={formData.phone}
          onChangeText={(value) => handleInputChange("phone", value)}
          style={styles.input}
        />
        <TextInput
          placeholder="Address"
          value={formData.address}
          onChangeText={(value) => handleInputChange("address", value)}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={formData.email}
          onChangeText={(value) => handleInputChange("email", value)}
          style={styles.input}
        />

        <Picker
          selectedValue={formData.product}
          onValueChange={(value) => handleInputChange("product", value)}
          style={styles.input}
        >
          <Picker.Item label="Select a Product" value="" />
          {products.map((product) => (
            <Picker.Item key={product.id} label={product.name} value={product.id.toString()} />
          ))}
        </Picker>

        <TextInput
          placeholder="Message"
          value={formData.message}
          onChangeText={(value) => handleInputChange("message", value)}
          style={styles.input}
        />
        <Button
          title="Create New Delivery"
          onPress={handleCreateDelivery}
          color="#4682b4"
        />
      </View>

      <FlatList
        data={deliveries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>გამოძახება {item.ordered_at}</Text>
                <Text style={styles.toggleIcon}>
                  {expanded === item.id ? "▼" : "▶"}
                </Text>
              </View>
            </TouchableOpacity>
            {expanded === item.id && (
              <View style={styles.cardContent}>
                <Text>Phone: {item.phone}</Text>
                <Text>Address: {item.address}</Text>
                <Text>Email: {item.email}</Text>
                <Text>Product ID: {item.product}</Text>
                <Text>Message: {item.message}</Text>
                <Text>თარიღი: {item.ordered_at}</Text>
              </View>
            )}
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    padding: 15,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    padding: 10,
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  toggleIcon: {
    fontSize: 18,
    color: "#888",
  },
  cardContent: {
    marginTop: 10,
    paddingLeft: 10,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
});

export default OilChangeScreen;
