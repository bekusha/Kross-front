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
} from "react-native";
import { useOilChange } from "../context/OilChangeContext";
import { useProducts } from "@/context/productContext";

import { User } from "@/types/user";

const OilChangeScreen = () => {
  const { deliveries, loading, error, fetchDeliveries, createDelivery } =
    useOilChange();

  const { products } = useProducts();

  // State for form inputs
  const [formData, setFormData] = useState({
    user: "",
    phone: "",
    address: "",
    email: "",
    product: "",
    message: "",
  });

  const [expanded, setExpanded] = useState<number | null>(null); // State to track expanded item

  // Function to handle form input changes
  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  // Function to handle form submission
  const handleCreateDelivery = () => {
    if (
      !formData.user ||
      !formData.phone ||
      !formData.address ||
      !formData.email ||
      !formData.product
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const newDelivery = {
      user: Number(formData.user),
      phone: formData.phone,
      address: formData.address,
      email: formData.email,
      product: Number(formData.product),
      message: formData.message,
    };

    createDelivery(newDelivery);

    // Reset only specific fields after submission
    setFormData((prevFormData) => ({
      ...prevFormData,
      phone: "",
      address: "",
      email: "",
      message: "",
    }));
  };

  const toggleExpand = (id: number) => {
    setExpanded(expanded === id ? null : id); // Toggle expansion
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // if (error) {
  //   return (
  //     <View style={styles.center}>
  //       <Text style={styles.errorText}>Error: {error}</Text>
  //       <Button title="Retry" onPress={fetchDeliveries} color="#ff6347" />
  //     </View>
  //   );
  // }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>ზეთის შეცვლა ადგილზე გამოძახებით</Text>

      {/* Form for creating a new delivery */}
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

        <TextInput
          placeholder="Message"
          value={formData.message}
          onChangeText={(value) => handleInputChange("message", value)}
          style={styles.input}
        />
        {/* i need dropdown for reactnative */ }

        {/* <TextInput
          placeholder="Product ID"
          value={formData.product}
          onChangeText={(value) => handleInputChange("product", value)}
          style={styles.input}
        /> */}

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
                <Text style={styles.cardTitle}>პროდუქტი {item.product}</Text>
                <Text style={styles.toggleIcon}>
                  {expanded === item.id ? "▼" : "▶"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Details shown only if the item is expanded */}
            {expanded === item.id && (
              <View style={styles.cardContent}>
                <Text>Phone: {item.phone}</Text>
                <Text>Address: {item.address}</Text>
                <Text>Email: {item.email}</Text>
                <Text>Product ID: {item.product}</Text>
                <Text>Message: {item.message}</Text>
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
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
