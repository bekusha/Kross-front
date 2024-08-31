import React, { useEffect } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { useProducts } from "@/context/productContext";

const ProductDetails = () => {
  const { products, fetchProducts } = useProducts();

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Assuming you want to display the first product as an example
  const product = products?.[0];

  if (!product) {
    return <Text>Loading...</Text>; // Handle loading state
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: product.image1 }}
        style={styles.productImage}
        resizeMode="contain"
      />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>${product.price}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  productImage: {
    width: "100%",
    height: 300,
    borderRadius: 8,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  productPrice: {
    fontSize: 20,
    color: "gray",
    marginVertical: 5,
  },
  productDescription: {
    fontSize: 16,
    marginVertical: 10,
  },
});

export default ProductDetails;
