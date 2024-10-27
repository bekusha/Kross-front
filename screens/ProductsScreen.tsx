import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useProducts } from "../context/productContext";
import { Product } from "@/types/product";

const ProductsScreen = ({ navigation, route }: any) => {
  const { fetchProducts, fetchProductsByCategory, products } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState(route.params?.filter || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const categoryId = route.params?.categoryId || null;

  // Fetch products when the component mounts or categoryId changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (categoryId) {
        const productsByCategory = await fetchProductsByCategory(categoryId);
        setFilteredProducts(productsByCategory);
      } else {
        const allProducts = await fetchProducts();
        setFilteredProducts(allProducts);
      }
      setLoading(false);
    };

    fetchData();
  }, [fetchProductsByCategory, fetchProducts, categoryId]);

  // Filter products based on the search query
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.filterInput}
        placeholder="რას ეძებ..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : filteredProducts.length > 0 ? (
        <FlatList
          style={styles.productList}
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() =>
                navigation.navigate("ProductDetails", { productId: item.id })
              }
            >
              <Image
                source={{ uri: item.image1 }}
                style={styles.productImage}
                resizeMode="contain"
              />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noProducts}>No products available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 10,
    paddingTop: 20,
    backgroundColor: "#f9f9f9",
  },
  filterInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  columnWrapper: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  productList: {},
  productCard: {
    flex: 1,
    margin: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "red",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  productImage: {
    width: Dimensions.get("window").width / 2 - 40,
    height: 150,
    borderRadius: 8,
  },
  noProducts: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "red",
  },
});

export default ProductsScreen;
