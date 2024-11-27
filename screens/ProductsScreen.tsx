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
import * as Animatable from 'react-native-animatable';
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

  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <Animatable.View
      key={index}
      animation="fadeInDown"
      duration={600}
      delay={index * 150}
      easing="ease-out"
      useNativeDriver={true}
      style={styles.productCard}
    >
      <Text style={styles.productName}>{item.name}</Text>
      <View style={{ overflow: 'hidden' }}>
        <Animatable.View
          animation={{
            0: {
              translateY: 200,
              opacity: 0,
            },
            1: {
              translateY: 0,
              opacity: 1,
            }
          }}
          duration={700}
          delay={index * 150 + 200}
          easing="ease-out"
          useNativeDriver={true}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("ProductDetails", { productId: item.id })}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: item.image1 }}
              style={styles.productImage}
              resizeMode="contain"
            />
            <Text style={styles.productPrice}>{item.price} ლარი</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <Animatable.View
        animation="fadeInDown"
        duration={600}
        easing="ease-out"
        useNativeDriver
        style={styles.searchContainer}
      >
        <TextInput
          style={styles.filterInput}
          placeholder="რას ეძებ..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Animatable.View>

      {loading ? (
        <ActivityIndicator color="#0000ff" />
      ) : (
        <FlatList
          style={styles.productList}
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={renderProduct}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    zIndex: 1,
  },
  filterInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
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