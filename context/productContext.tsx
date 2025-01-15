import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Product, ProductContextType, Category } from "../types/product";
import apiClient from "./axiosInstance"; // გამოიყენება apiClient

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const deleteProduct = useCallback(async (productId: number) => {
    try {
      await apiClient.delete(`/product/${productId}/`);
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
      const response = await apiClient.get(`/product/${productId}/`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  }, []);

  const editProduct = useCallback(async (productId: number, formData: FormData) => {
    try {
      const response = await apiClient.put(`/product/${productId}/`, formData);
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === productId ? response.data : product
        )
      );
      console.log("Product edited successfully:", response.data);
    } catch (error) {
      console.error("Failed to edit product:", error);
    }
  }, []);

  const addProduct = useCallback(async (formData: FormData, categoryId: number) => {
    try {
      const response = await apiClient.post(`/product/`, formData, {
        params: { category: categoryId },
      });
      setProducts((currentProducts) => [...currentProducts, response.data]);
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await apiClient.get(`/product/`);
      setProducts(response.data);
      console.log("Products fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return [];
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiClient.get(`/product/categories/`);
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  const fetchProductsByCategory = useCallback(async (categoryId: number) => {
    try {
      const response = await apiClient.get(`/product/`, {
        params: { category: categoryId },
      });
      console.log("Products by category fetched:", response.data);
      setProducts(response.data);
      return response.data;
    } catch (error) {
      console.error(
        `Failed to fetch products for category ${categoryId}:`,
        error
      );
      return [];
    }
  }, []);

  const fetchProductsByVendor = useCallback(async (vendorId: number) => {
    try {
      const response = await apiClient.get(`/product/products/by_vendor/${vendorId}/`);
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
      }}
    >
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
