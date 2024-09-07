import React, { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, Button, Alert } from "react-native";
import { useProducts } from "@/context/productContext";
import { useCart } from "@/context/cartContext";
const ProductDetails = () => {
  const { products, fetchProducts } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Assuming you want to display the first product as an example
  const product = products?.[0];

  // Handle Add to Cart action
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      console.log("წარმატება", `${product.name} დამატებულია კარტაში!`);
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

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
      <Button title="Add to Cart" onPress={handleAddToCart} />
      <View>
        <Button title="+" onPress={incrementQuantity} />
        <Text>{quantity}</Text>
        <Button title="+" onPress={decrementQuantity} />
      </View>
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
