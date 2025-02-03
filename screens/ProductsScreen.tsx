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
import SelectedProductsBar from "@/components/SelectedProductsBar";

const ProductsScreen = ({ navigation, route }: any) => {
  const { fetchProducts, fetchProductsByCategory, products } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  // const [filter, setFilter] = useState(route.params?.filter || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const categoryId = route.params?.categoryId || null;
  // const [isFromOilChangeScreen, setIsFromOilChangeScreen] = useState(false);
  const isFromOilChangeScreen = route.params?.fromOilChangeScreen || false;
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

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

  const changeQuantity = (productId: number, amount: number) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.map((product) =>
        product.id === productId
          ? { ...product, quantity: Math.max(1, product.quantity! + amount) }
          : product
      )
    );
  };

  const toggleProductSelection = (product: Product) => {
    setSelectedProducts((prevSelected) => {
      const isAlreadySelected = prevSelected.some((p) => p.id === product.id);
      if (isAlreadySelected) {
        return prevSelected.filter((p) => p.id !== product.id);
      } else {
        return [...prevSelected, { ...product, quantity: 1 }];
      }
    });
  };

  const renderProduct = ({ item, index }: { item: Product; index: number }) => {
    const isSelected = selectedProducts.some((p) => p.id === item.id);
    const selectedProduct = selectedProducts.find((p) => p.id === item.id);

    return (
      <Animatable.View
        key={index}
        animation="fadeInDown"
        duration={600}
        delay={index * 150}
        easing="ease-out"
        useNativeDriver={true}
        style={[styles.productCard, isSelected && styles.selectedProduct]}
      >
        <Text style={styles.productName}>{item.name}</Text>
        <View style={{ overflow: "hidden" }}>
          <Animatable.View
            animation={{
              0: { translateY: 200, opacity: 0 },
              1: { translateY: 0, opacity: 1 },
            }}
            duration={700}
            delay={index * 150 + 200}
            easing="ease-out"
            useNativeDriver={true}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ProductDetails", { productId: item.id })
              }
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: item.image1 }}
                style={styles.productImage}
                resizeMode="contain"
              />
              <Text style={styles.productVolume}>ბოთლის მოცულობა {item.liter}L</Text>
              <Text style={styles.productPrice}>{item.price} ლარი</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>

        {isFromOilChangeScreen && (
          <View style={styles.buttonsContainer}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => changeQuantity(item.id, -1)}
                disabled={!isSelected}
              >
                <Text style={[styles.calcButtons, !isSelected && styles.disabledButton]}>-</Text>
              </TouchableOpacity>

              <Text style={styles.quantityText}>
                {selectedProduct?.quantity ?? 0}
              </Text>

              <TouchableOpacity onPress={() => changeQuantity(item.id, 1)}>
                <Text style={[styles.calcButtons, !isSelected && styles.disabledButton]}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => toggleProductSelection(item)}
            >
              <Text style={styles.selectButtonText}>
                {isSelected ? "წაშლა" : "დაამატე პროდუქტი"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Animatable.View>
    );
  };



  return (
    <View style={styles.container}>
      <Animatable.View
        animation="fadeInDown"
        duration={600}
        easing="ease-out"
        useNativeDriver
        style={styles.searchContainer}
      >
        <SelectedProductsBar
          selectedProducts={selectedProducts}
          onRemove={(productId) =>
            setSelectedProducts((prev) => prev.filter((p) => p.id !== productId))
          }
          onConfirm={() =>
            navigation.navigate("OilChangeScreen", {
              orderItems: selectedProducts // მთლიანად გადავცემთ 
            })
          }
        />
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
    flexDirection: "row",
    justifyContent: "space-between",

  },
  productVolume: {
    fontSize: 12,
    color: "black",
  },
  productList: {},
  productCard: {
    flex: 1,
    margin: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",

  },
  selectButton: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  selectButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  confirmButton: {
    backgroundColor: "#ff4500",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    alignSelf: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  calcButtons: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
    marginRight: 5,
    marginLeft: 5,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  selectedProduct: {
    borderColor: "green",
    borderWidth: 2,
  },

  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    color: "red",
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
  disabledButton: {
    backgroundColor: "#ccc", // გამორთული ფერი
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ProductsScreen;