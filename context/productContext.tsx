import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import axios from "axios";
import localStorage from "@react-native-async-storage/async-storage";
import { Product, ProductContextType, Category } from "../types/product";
import { API_BASE_URL } from "@env";

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const getAuthHeader = async () => {
    const token = await localStorage.getItem("access");
    return { Authorization: `Bearer ${token}` };
  };

  const deleteProduct = useCallback(async (productId: number) => {
    try {
      const headers = await getAuthHeader();
      await axios.delete(`${API_BASE_URL}product/${productId}/`, { headers });
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId)
      );
      console.log("Product deleted successfully");
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  }, []);

  const fetchProductById = useCallback(async (productId: number) => {
    try {
      const headers = await getAuthHeader();
      const response = await axios.get(`${API_BASE_URL}product/${productId}/`, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  }, []);

  const editProduct = useCallback(
    async (productId: number, formData: FormData) => {
      try {
        const headers = await getAuthHeader();
        const response = await axios.put(
          `${API_BASE_URL}product/${productId}/`,
          formData,
          { headers }
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
        const headers = await getAuthHeader();
        const response = await axios.post(`${API_BASE_URL}product/`, formData, {
          headers,
          params: { category: categoryId },
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
      return response.data; // Add this line to return data
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return []; // Return an empty array on error
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

  const fetchProductsByCategory = useCallback(async (categoryId: number) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}product/?category=${categoryId}`
      );
      console.log(response.data);
      setProducts(response.data);
      return response.data; // Add this line to return data
    } catch (error) {
      console.error(
        `Failed to fetch products for category ${categoryId}:`,
        error
      );
      return []; // Return an empty array on error
    }
  }, []);

  const fetchProductsByVendor = useCallback(async (vendorId: number) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}product/products/by_vendor/${vendorId}/`
      );
      setProducts(response.data);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch products for vendor ${vendorId}:`, error);
      return [];
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
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
