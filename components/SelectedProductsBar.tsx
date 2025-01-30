import React from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import { Product } from "@/types/product";

const SelectedProductsBar = ({
    selectedProducts,
    onRemove,
    onConfirm,
}: {
    selectedProducts: Product[];
    onRemove: (productId: number) => void;
    onConfirm: () => void;
}) => {
    if (selectedProducts.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>არჩეული პროდუქტები</Text>
            <FlatList
                data={selectedProducts}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                renderItem={({ item }) => (
                    <View style={styles.productItem}>
                        <Text style={styles.productName}>{item.name} ({item.quantity}x)</Text>
                        <TouchableOpacity onPress={() => onRemove(item.id)}>
                            <Text style={styles.removeText}>წაშლა</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                <Text style={styles.confirmButtonText}>დაამატე და დაბრუნდი შეკვეთაში ({selectedProducts.length})</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#ddd",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    productItem: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 10,
        backgroundColor: "#f8f8f8",
        padding: 5,
        borderRadius: 5,
    },
    productName: {
        fontSize: 14,
        marginRight: 8,
    },
    removeText: {
        color: "red",
        fontSize: 14,
        fontWeight: "bold",
    },
    confirmButton: {
        backgroundColor: "#ff4500",
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        alignItems: "center",
    },
    confirmButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default SelectedProductsBar;
