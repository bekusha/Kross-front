import React from "react";
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
  const { oilChangeOrders } = useCart();

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.title}>შეკვეთის დეტალები</Text>
              {/* მონაცემების შემოწმება */}
              {oilChangeOrders && oilChangeOrders.order ? (
                <ScrollView>
                  {/* შეკვეთის ძირითადი ინფორმაცია */}
                  <View style={styles.orderDetails}>
                    <Text style={styles.orderText}>
                      Order ID:{" "}
                      <Text style={styles.orderValue}>
                        {oilChangeOrders.order.id}
                      </Text>
                    </Text>
                    <Text style={styles.orderText}>
                      Order Type:{" "}
                      <Text style={styles.orderValue}>
                        {oilChangeOrders.order.order_type}
                      </Text>
                    </Text>
                    <Text style={styles.orderText}>
                      Status:{" "}
                      <Text style={styles.orderValue}>
                        {oilChangeOrders.order.status}
                      </Text>
                    </Text>
                    <Text style={styles.orderText}>
                      Ordered At:{" "}
                      <Text style={styles.orderValue}>
                        {new Date(
                          oilChangeOrders.order.ordered_at
                        ).toLocaleString()}
                      </Text>
                    </Text>
                    <Text style={styles.orderText}>
                      User ID:{" "}
                      <Text style={styles.orderValue}>
                        {oilChangeOrders.order.user}
                      </Text>
                    </Text>
                  </View>

                  {/* შეკვეთის ელემენტები */}
                  <Text style={styles.itemsTitle}>პროდუქტები:</Text>
                  {oilChangeOrders.order_items ? (
                    oilChangeOrders.order_items.map((item: any, index: any) => (
                      <View key={index} style={styles.orderItem}>
                        <Text style={styles.orderItemText}>
                          Product ID:{" "}
                          <Text style={styles.orderItemValue}>
                            {item.product}
                          </Text>
                        </Text>
                        <Text style={styles.orderItemText}>
                          Quantity:{" "}
                          <Text style={styles.orderItemValue}>
                            {item.quantity}
                          </Text>
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noItemsText}>
                      პროდუქტები არ არის დამატებული.
                    </Text>
                  )}
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
    color: "#FF6347", // Title color
  },
  orderDetails: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f9f9f9", // Light background for order details
    borderRadius: 8,
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333", // Darker text for better readability
  },
  orderValue: {
    fontWeight: "bold",
    color: "#FF6347", // Highlighted value color
  },
  itemsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FF6347", // Title color for items
  },
  orderItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd", // Light border for separation
  },
  orderItemText: {
    color: "#333", // Darker text for better readability
  },
  orderItemValue: {
    fontWeight: "bold",
    color: "#FF6347", // Highlighted value color for items
  },
  noItemsText: {
    color: "#999", // Lighter color for no items message
    textAlign: "center",
  },
  noOrdersText: {
    color: "#999", // Lighter color for no orders message
    textAlign: "center",
  },
});

export default OrderModal;
