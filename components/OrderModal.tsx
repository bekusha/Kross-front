import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
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
                      <Text style={styles.orderValue}>{orders.status}</Text>
                    </Text>
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
                <Text style={styles.noOrdersText}>შეკვეთები არ არის</Text>
              )}
              <Button title="დახურვა" onPress={onClose} color="#FF6347" />
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#FF6347",
  },
  orderDetails: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  orderValue: {
    fontWeight: "bold",
    color: "#FF6347",
  },
  noOrdersText: {
    color: "#999",
    textAlign: "center",
  },
});

export default OrderModal;
