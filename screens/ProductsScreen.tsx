import { useProducts } from "../context/productContext";
import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Config from "react-native-config";
const ProductsScreen = () => {
  const { products, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
    console.log(Config.API_BASE_URL);
  }, [fetchProducts]);

  return (
    <View>
      <Text>Hi</Text>
    </View>
    // <View style={styles.container}>
    //   {products.length > 0 ? (
    //     <FlatList
    //       data={products}
    //       keyExtractor={(item) => item.id.toString()}
    //       renderItem={({ item }) => (
    //         <View style={styles.productCard}>
    //           <Text style={styles.productName}>{item.name}</Text>
    //           <Text style={styles.productPrice}>${item.price}</Text>
    //         </View>
    //       )}
    //     />
    //   ) : (
    //     <Text style={styles.noProducts}>No products available</Text>
    //   )}
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  productCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 16,
    color: "gray",
  },
  noProducts: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "red",
  },
});

export default ProductsScreen;
