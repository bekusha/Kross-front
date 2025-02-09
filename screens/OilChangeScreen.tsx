import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import { useAuth } from "@/context/authContext";
import { NavigationProp, useNavigation, } from "@react-navigation/native";
import { RootStackParamList } from "@/types/routes";
import { useCart } from "@/context/cartContext";
import Icon from 'react-native-vector-icons/MaterialIcons';

const OilChangeScreen = ({ route }: { route: any }) => {
  const { purchase, orders } = useCart();
  const { user } = useAuth();
  type AuthScreenNavigationProp = NavigationProp<RootStackParamList, "AuthScreen">;
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const { selectedProduct, quantity, orderItems = [], carData = {} } = route.params || {};
  const isMultipleProducts = Array.isArray(orderItems) && orderItems.length > 0;

  const [formData, setFormData] = useState({
    phone: user?.phone || "",
    car_make: carData?.car_make || user?.car_make || "",
    car_model: carData.car_make,
    car_year: user?.car_year || "",
    car_mileage: user?.car_mileage || "",
    address: user?.address || "",
    email: user?.email || "",
    ordered_at: "",
    product: isMultipleProducts
      ? orderItems.map(item => ({
        ...item,
        quantity: item.recommended_quantity || 1, // აქ ჩასვით რაოდენობა სწორად
      }))
      : selectedProduct
        ? {
          ...selectedProduct,
          quantity: selectedProduct.recommended_quantity || 1
        }
        : null,
  });


  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    if (isMultipleProducts) {
      setFormData((prev) => ({
        ...prev,
        quantity: orderItems.map(item => item.recommended_quantity || 1), // ✅ აქ მხოლოდ რიცხვები გვაქვს
      }));
    } else if (selectedProduct) {
      setFormData((prev) => ({
        ...prev,
        quantity: selectedProduct.recommended_quantity || 1, // ✅ მხოლოდ ერთი რიცხვი
      }));
    }
    console.log("Updated formData:", formData); // ✅ ვამოწმებთ განახლებას
  }, [orderItems, selectedProduct]);




  const handleInputChange = (name: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const navigateToProducts = () => {
    navigation.navigate("Products", { fromOilChangeScreen: true });
  };

  const handlePurchase = async () => {
    if (!formData.phone.trim()) {
      Alert.alert("შეცდომა", "გთხოვთ შეიყვანოთ მობილურის ნომერი.");
      return;
    } else if (!formData.address.trim()) {
      Alert.alert("შეცდომა", "გთხოვთ შეიყვანოთ მისამართი.");
      return;
    }

    const orderType = "oil_change";
    const additionalInfo = {
      phone: formData.phone,
      address: formData.address,
      email: formData.email,
    };

    let orderPayload = isMultipleProducts
      ? orderItems.map(item => ({
        product_id: item.id,
        quantity: item.recommended_quantity || 1, // სწორად გადავცემთ რაოდენობას
      }))
      : [{
        product_id: selectedProduct?.id,
        quantity: selectedProduct?.recommended_quantity || 1
      }];

    console.log("შეკვეთის მონაცემები:", { orderPayload, orderType, additionalInfo });

    purchase(orderPayload, orderType, additionalInfo);
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
        <ScrollView style={styles.form}>
          <TextInput
            placeholder="მობილურის ნომერი"
            value={formData.phone}
            onChangeText={(value) => handleInputChange("phone", value)}
            style={[styles.input, { borderColor: !formData.phone.trim() ? "red" : "#ccc" }]}
          />

          <TextInput
            placeholder="ავტომობილი"
            value={formData.car_make}
            onChangeText={(value) => handleInputChange("car_make", value)}
            style={styles.input}
          />

          {/* <TextInput
            placeholder="გარბენი"
            value={formData.car_mileage}
            onChangeText={(value) => handleInputChange("car_mileage", value)}
            style={styles.input}
          /> */}
          <TextInput
            placeholder="მისამართი"
            value={formData.address}
            onChangeText={(value) => handleInputChange("address", value)}
            style={styles.input}
          />
          {isMultipleProducts ? (
            <View>
              <Text style={styles.title}>შერჩეული პროდუქტები:</Text>
              {orderItems.map((product, index) => (
                <View key={index}>
                  <Text>პროდუქტი: {product.name}</Text>
                  <Text>რაოდენობა: {product.recommended_quantity} ბოთლი</Text>
                  <Text>ფასი: <Text>{(product.price * product.recommended_quantity).toString()} ლარი</Text></Text>
                </View>
              ))}
              <Text style={{ color: "red" }}>ჯამი: <Text>{orderItems.reduce((acc, item) => acc + (item.price * item.recommended_quantity), 0).toString()} ლარი</Text></Text>

            </View>
          ) : selectedProduct ? (
            <View>
              <Text>შერჩეული პროდუქტი: {selectedProduct.name}</Text>
              <View>
                <Text>რაოდენობა: {Array.isArray(quantity) ? quantity.join(", ") : quantity} ბოთლი</Text>
              </View>
              <Text>ფასი: {selectedProduct.price * quantity} ლარი</Text>
            </View>
          ) : (
            <View style={styles.center}>
              <Text style={styles.infoText}>
                სერვისის გამოძახებისთვის გთხოვთ, ჯერ აირჩიოთ პროდუქტი.
              </Text>
              <Icon name="done" style={{ marginBottom: 10 }} size={25} color="green" />
              <TouchableOpacity
                style={styles.navigateButton}
                onPress={navigateToProducts}
              >
                <Text style={styles.navigateButtonText}>პროდუქტების ნახვა</Text>
              </TouchableOpacity>
            </View>
          )}





          <TouchableOpacity

            onPress={handlePurchase}

            style={styles.submitButton}

          ><Text style={styles.submitButtonText}>სერვისის გამოძახება</Text></TouchableOpacity>
        </ScrollView>
        {orders && (
          <Text style={styles.title}>შენი სერვისების ისტორია</Text>
        )}
        <FlatList
          data={orders}
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
    height: "100%",
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
  navigateButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 8,
  },
  navigateButtonText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },

  infoText: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",

    padding: 10,

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
    backgroundColor: "red",
    width: "100%",
    height: 40,

    paddingTop: 10,
    borderRadius: 8,
  },
  submitButtonText: {
    fontWeight: "bold",
    color: "black",
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
