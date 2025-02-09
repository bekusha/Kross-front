import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import apiClient from "@/context/axiosInstance";
interface SavedOrder {
    id: number;
    mileage: number;
    oil_used_name: string;
    created_at: string;
}

const SavedOrders: React.FC = () => {
    const [orders, setOrders] = useState<SavedOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSavedOrders();
    }, []);

    const fetchSavedOrders = async () => {
        try {
            const response = await apiClient.get(`order/saved-orders/`);
            console.log("saved orders", response.data)
            setOrders(response.data);
        } catch (err) {
            setError("შეცდომა მონაცემების მიღებისას!");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }

    return (
        <View style={styles.container}>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.orderCard}>
                        <Text style={styles.orderText}>🔧 ზეთი:<Text style={styles.orderDataText} > {item.oil_used_name}</Text></Text>
                        <Text style={styles.orderText}>📏 გარბენი: <Text style={styles.orderDataText}>{item.mileage} კმ</Text></Text>
                        <Text style={styles.orderText}>📏 შემდეგი შეცვლა: <Text style={styles.orderDataText}>{item.mileage === 0 ? 0 : item.mileage + 6000} კმ</Text></Text>
                        <Text style={styles.orderDate}>📅 თარიღი: {new Date(item.created_at).toLocaleDateString()}</Text>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>📭 შეკვეთების ისტორია ცარიელია </Text>
                        <Text style={styles.emptySubText}>როდესაც შეკვეთას გააფორმებთ აქ საჭირო ინფორმაცია დაგხვდებათ.</Text>

                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f8f9fa",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    orderCard: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    orderText: {
        fontSize: 16,
        marginBottom: 5,
    },
    orderDate: {
        fontSize: 14,
        color: "gray",
    },
    orderDataText: {
        fontWeight: "bold",
        color: "red",
    },
    error: {
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
    emptyContainer: {
        marginTop: 50,
        alignItems: "center",

    },
    emptyText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#555",
        textAlign: "center",
    },
    emptySubText: {
        fontSize: 14,
        color: "#777",
        marginTop: 5,
        textAlign: "center",
    },
});

export default SavedOrders;
