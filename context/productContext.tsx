import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Product, ProductContextType, Category } from "../types/product";
const ProductContext = createContext<ProductContextType | undefined>(undefined);

import { API_BASE_URL } from "@env";

console.log("API Base URL:", API_BASE_URL);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}): React.ReactElement => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const deleteProduct = useCallback(async (productId: number) => {
    try {
      const token = await AsyncStorage.getItem("access");
      await axios.delete(`${API_BASE_URL}product/${productId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId)
      );
      console.log("Product deleted successfully");
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  }, []);

  const editProduct = useCallback(
    async (productId: number, formData: FormData) => {
      try {
        const token = await AsyncStorage.getItem("access");
        const response = await axios.put(
          `${API_BASE_URL}product/${productId}/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.id === productId ? response.data : product
          )
        );
        console.log("Product edited successfully:", response.data);
      } catch (error) {
        console.error("Failed to edit product:", error);
      }
    },
    []
  );

  const addProduct = useCallback(
    async (formData: FormData, categoryId: number) => {
      try {
        const token = await AsyncStorage.getItem("access");
        const response = await axios.post(`${API_BASE_URL}product/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            category: categoryId,
          },
        });
        setProducts((currentProducts) => [...currentProducts, response.data]);
      } catch (error) {
        console.error("Failed to add product:", error);
      }
    },
    []
  );

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}product/`);
      setProducts(response.data);
      console.log(API_BASE_URL);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}product/categories/`);
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  // Add the missing fetchProductsByCategory function
  const fetchProductsByCategory = useCallback(async (categoryId: number) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}product/?category=${categoryId}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error(
        `Failed to fetch products for category ${categoryId}:`,
        error
      );
    }
  }, []);

  // Add the missing fetchProductsByVendor function
  const fetchProductsByVendor = useCallback(async (vendorId: number) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}product/products/by_vendor/${vendorId}/`
      );
      setProducts(response.data);
    } catch (error) {
      console.error(`Failed to fetch products for vendor ${vendorId}:`, error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        categories,
        fetchProductsByCategory,
        fetchProducts,
        editProduct,
        deleteProduct,
        fetchProductsByVendor,
      }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined || context === null) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
