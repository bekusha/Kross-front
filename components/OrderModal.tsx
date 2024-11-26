import React from "react";
import { Modal, View, Text, StyleSheet, Button, ScrollView } from "react-native";
import { useCart } from "@/context/cartContext";

const OrderModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    const { oilChangeOrders } = useCart();

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>შეკვეთის დეტალები</Text>
                    {/* მონაცემების შემოწმება */}
                    {oilChangeOrders && oilChangeOrders.order ? (
                        <ScrollView>
                            {/* შეკვეთის ძირითადი ინფორმაცია */}
                            <View style={styles.orderDetails}>
                                <Text>Order ID: {oilChangeOrders.order.id}</Text>
                                <Text>Order Type: {oilChangeOrders.order.order_type}</Text>
                                <Text>Status: {oilChangeOrders.order.status}</Text>
                                <Text>Ordered At: {new Date(oilChangeOrders.order.ordered_at).toLocaleString()}</Text>
                                <Text>User ID: {oilChangeOrders.order.user}</Text>
                            </View>

                            {/* შეკვეთის ელემენტები */}
                            <Text style={styles.itemsTitle}>პროდუქტები:</Text>
                            {oilChangeOrders.order_items ? (
                                oilChangeOrders.order_items.map((item: any, index: any) => (
                                    <View key={index} style={styles.orderItem}>
                                        <Text>Product ID: {item.product}</Text>
                                        <Text>Quantity: {item.quantity}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text>პროდუქტები არ არის დამატებული.</Text>
                            )}
                        </ScrollView>
                    ) : (
                        <Text>შეკვეთები არ არის</Text>
                    )}

                    <Button title="დახურვა" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        maxHeight: "70%",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    orderDetails: {
        marginBottom: 20,
    },
    itemsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    orderItem: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 5,
    },
});

export default OrderModal;
