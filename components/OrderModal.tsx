import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useCart } from "@/context/cartContext";

const OrderModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { orders } = useCart();

  useEffect(() => {
    if (visible && orders) {
      console.log("Order modal opened:", orders.order_id);
    }
  }, [visible, orders]);

  const renderStatusMessage = (status: string) => {
    switch (status) {
      case "pending":
        return "მოლოდინის რეჟიმი: შეკვეთა ელოდება კურიერის მიმაგრებას.";
      case "in_progress":
        return `შეკვეთა მიმდინარეობს.`;
      case "completed":
        return "შეკვეთა დასრულებულია.";
      default:
        return `შეკვეთის სტატუსი: ${status}`;
    }
  };

  const renderCourierDetails = () => {
    if (orders?.status === "in_progress" && orders?.courier_name) {
      return (
        <View style={styles.courierDetails}>
          <Text style={styles.courierText}>
            კურიერი: <Text style={styles.orderValue}>{orders.courier_name}</Text>
          </Text>
          <Text style={styles.courierText}>
            ტელეფონი:{" "}
            <Text style={styles.orderValue}>
              {orders.courier_number || "მიუწვდომელია"}
            </Text>
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.title}>შეკვეთის დეტალები</Text>
              {orders ? (
                <ScrollView>
                  <View style={styles.orderDetails}>
                    <Text style={styles.orderText}>
                      Order ID:{" "}
                      <Text style={styles.orderValue}>{orders.order_id}</Text>
                    </Text>
                    <Text style={styles.orderText}>
                      Order Type:{" "}
                      <Text style={styles.orderValue}>{orders.order_type}</Text>
                    </Text>
                    <Text style={styles.orderText}>
                      Status:{" "}
                      <Text style={styles.orderValue}>
                        {renderStatusMessage(orders.status)}
                      </Text>
                    </Text>
                    {renderCourierDetails()}
                    <Text style={styles.orderText}>
                      Phone:{" "}
                      <Text style={styles.orderValue}>{orders.phone || "N/A"}</Text>
                    </Text>
                    <Text style={styles.orderText}>
                      Email:{" "}
                      <Text style={styles.orderValue}>{orders.email || "N/A"}</Text>
                    </Text>
                    <Text style={styles.orderText}>
                      Address:{" "}
                      <Text style={styles.orderValue}>
                        {orders.address || "N/A"}
                      </Text>
                    </Text>
                  </View>
                </ScrollView>
              ) : (
                <View style={styles.noOrdersContainer}>
                  <Text style={styles.noOrdersText}>შეკვეთები არ არის</Text>
                </View>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>დახურვა</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "90%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    maxHeight: "80%",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
    color: "#FF6347",
  },
  orderDetails: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
  },
  orderValue: {
    fontWeight: "bold",
    color: "#333",
  },
  courierDetails: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#e9f5ff",
    borderRadius: 8,
  },
  courierText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  noOrdersContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  noOrdersText: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#FF6347",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default OrderModal;