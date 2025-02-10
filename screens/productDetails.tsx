import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal
} from "react-native";
import { useProducts } from "@/context/productContext";
import { useCart } from "@/context/cartContext";
import { useAuth } from "@/context/authContext";



const ProductDetails = ({ route, navigation }: any) => {
  const { products, fetchProducts } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();

  const productId = route.params?.productId; // მიღებულია productId from route params

  useEffect(() => {
    fetchProducts();

    console.log("Is Logged In: " + isLoggedIn)
  }, []);

  // არჩეული პროდუქტის მოძებნა products მასივში id-ს მიხედვით
  const product = products.find((p) => p.id === productId);
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setModalVisible(true); // გახსნის მოდალს
    } else {
      if (product) {
        addToCart(product, quantity);
        setSuccessModalVisible(true);
      }
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
    return <Text>Loading...</Text>; // ლოდინის სტატუსის მართვა
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: product.image1 }}
        style={styles.productImage}
        resizeMode="contain"
      />
      <View style={styles.namePrice} ><Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>{product.price}ლარი</Text></View>
      <View style={styles.stockContainer}>
        <Text style={[styles.productStock, product.quantity ? styles.inStock : styles.outOfStock]}>
          {product.quantity ? `მარაგშია: ${product.quantity} ერთეული` : "მარაგი ამოწურილია"}
        </Text>
      </View>
      <ScrollView><Text style={styles.productDescription}>{product.description}</Text></ScrollView>
      <View style={styles.quantityContainer}>

        <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity style={styles.quantityButton} onPress={decrementQuantity}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>

      </View>
      <TouchableOpacity style={styles.basketButton} onPress={handleAddToCart}>
        <Text style={styles.basketButtonText}>კალათში დამატება</Text>

        <Modal
          animationType="slide"
          transparent={true}
          visible={successModalVisible}
          onRequestClose={() => setSuccessModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                პროდუქტი წარმატებით დაემატა, შეგიძლიათ იხილოთ თაბზე :  "ჩემი გვერდი"
              </Text>
              <TouchableOpacity
                style={styles.okButton}
                onPress={() => setSuccessModalVisible(false)}>
                <Text style={styles.okButtonText}>გასაგებია</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",

  },
  productImage: {
    width: "80%",
    height: "30%",
    borderRadius: 8,
    marginTop: 50
  },
  namePrice: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 100,
    gap: 10
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
    fontSize: 14,
    marginVertical: 10,
  },
  basketButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    color: "red",
    textAlign: "center",
    fontSize: 16,
    marginVertical: 10,
  },
  basketButtonText: {
    color: "black",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    color: "black",
    textAlign: "center",
    fontSize: 20,
  },
  quantityText: {
    fontSize: 20,
    marginHorizontal: 10,
    fontWeight: "bold",
  },
  quantityButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    width: 30,
    height: 30,
    backgroundColor: "red",
    textAlign: "center",
    borderRadius: 4,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  okButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 10,
  },
  okButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
  },

  stockContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  productStock: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  inStock: {
    color: "green",
  },
  outOfStock: {
    color: "red",
  },

});

export default ProductDetails;
