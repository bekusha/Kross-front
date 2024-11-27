import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useAuth } from "@/context/authContext";
import { NavigationProp, useNavigation, } from "@react-navigation/native";
import { RootStackParamList } from "@/types/routes";
import { useCart } from "@/context/cartContext";

const OilChangeScreen = ({ route }: { route: any }) => {
  const { purchase, oilChangeOrders } = useCart();
  const { user, isLoggedIn } = useAuth();
  type AuthScreenNavigationProp = NavigationProp<RootStackParamList, "AuthScreen">;
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const { selectedProduct, quantity } = route.params || {};

  const [deliveries, setDeliveries] = useState([]);

  // State for form inputs
  const [formData, setFormData] = useState({
    phone: user?.phone || "",
    car_make: user?.car_make || "",
    car_model: user?.car_model || "",
    car_year: user?.car_year || "",
    car_mileage: user?.car_mileage || "",
    address: user?.address || "",
    email: user?.email || "",
    ordered_at: "",
    product: selectedProduct?.id || 0,
    quantity: quantity
  });

  const [expanded, setExpanded] = useState<number | null>(null);



  useEffect(() => {


  }, []);


  const handleInputChange = (name: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handlePurchase = async () => {
    const orderItems = [
      {
        product_id: formData.product,
        quantity: formData.quantity,
      },
    ],
      orderType = "oil_change",
      additionalInfo = {
        phone: formData.phone,
        address: formData.address,
        email: formData.email,
      };
    console.log(orderItems, orderType, additionalInfo);
    purchase(orderItems, orderType, additionalInfo);
  };



  const toggleExpand = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ka-GE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };





  return (
    <KeyboardAvoidingView style={styles.container}>
      <KeyboardAvoidingView>
        <View style={styles.form}>
          <TextInput
            placeholder="მობილურის ნომერი"
            value={formData.phone}
            onChangeText={(value) => handleInputChange("phone", value)}
            style={styles.input}
          />
          <TextInput
            placeholder="მანქანის მწარმოებელი"
            value={formData.car_make}
            onChangeText={(value) => handleInputChange("car_make", value)}
            style={styles.input}
          />
          <TextInput
            placeholder="მანქანის მოდელი"
            value={formData.car_model}
            onChangeText={(value) => handleInputChange("car_model", value)}
            style={styles.input}
          />
          <TextInput
            placeholder="გამოშვების წელი"
            value={formData.car_year}
            onChangeText={(value) => handleInputChange("car_year", value)}
            style={styles.input}
          />
          <TextInput
            placeholder="გარბენი"
            value={formData.car_mileage}
            onChangeText={(value) => handleInputChange("car_mileage", value)}
            style={styles.input}
          />
          <TextInput
            placeholder="მისამართი"
            value={formData.address}
            onChangeText={(value) => handleInputChange("address", value)}
            style={styles.input}
          />
          {/* <TextInput
            placeholder="test@mail.com"
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            style={styles.input}
          /> */}
          {selectedProduct ? (
            <View><Text>შერჩეული პროდუქტი: {selectedProduct.name}</Text>
              <Text>რაოდენობა: {quantity} ბოთლი</Text>
              <Text>ფასი: {selectedProduct.price * quantity} ლარი</Text>
            </View>

          ) : null}



          <TouchableOpacity

            onPress={handlePurchase}

            style={styles.submitButton}

          ><Text style={styles.submitButtonText}>სერვისის გამოძახება</Text></TouchableOpacity>
        </View>

        {/* <Text style={styles.title}>შენი სერვისის გამოძახების ისტორია</Text> */}
        {/* if changedeliveries.length !== 0 show view above */}
        {oilChangeOrders && (
          <Text style={styles.title}>შენი სერვისების ისტორია</Text>
        )}
        <FlatList
          data={oilChangeOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>თარიღი: {formatDate(item.ordered_at)}</Text>
                  <Text style={styles.toggleIcon}>
                    {expanded === item.id ? "▼" : "▶"}
                  </Text>
                </View>
              </TouchableOpacity>
              {expanded === item.id && (
                <View style={styles.cardContent}>
                  <Text>ტელეფონის ნომერი: {item.phone}</Text>
                  <Text>მისამართი: {item.address}</Text>
                  {/* <Text>მეილი: {item.email}</Text> */}
                  <Text>პროდუქტი: {item.product}</Text>
                  <Text>შეტყობინება {item.message}</Text>
                  <Text>თარიღი: {formatDate(item.ordered_at)}</Text>
                </View>
              )}
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    marginTop: 15,
  },
  redText: {
    color: "red",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    padding: 10,
    fontSize: 16,
    // height: 35,
  },
  dropdown: {
    backgroundColor: '#fafafa',
    borderColor: '#ccc',
    marginVertical: 10,
  },
  inputAdditionalText: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    padding: 10,
    fontSize: 16,
    height: 75,
  },
  submitButton: {
    marginTop: 15,
    backgroundColor: "black",
    width: "100%",
    height: 40,

    paddingTop: 10,
    borderRadius: 8,
  },
  submitButtonText: {

    color: "white",
    textAlign: "center",
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
