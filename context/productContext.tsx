import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import axios from "axios";
import {
  Product,
  ProductContextType,
  Category,
  NewProductData,
} from "@/types/product";

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}): React.ReactElement => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const deleteProduct = useCallback(async (productId: number) => {
    const token = localStorage.getItem("access");
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}product/${productId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      const token = localStorage.getItem("access"); // Or wherever you store your token
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}product/${productId}/`,
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
      const token = localStorage.getItem("access"); // Or wherever you store your token
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}product/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              category: categoryId,
            },
          }
        );
        setProducts((currentProducts) => [...currentProducts, response.data]);
      } catch (error) {
        console.error("Failed to add product:", error);
      }
    },
    []
  );

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL!}product/`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}product/categories/`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  const fetchProductsByCategory = useCallback(async (categoryId: number) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}product/?category=${categoryId}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error(
        `Failed to fetch products for category ${categoryId}:`,
        error
      );
    }
  }, []);

  const fetchProductsByVendor = useCallback(async (vendorId: number) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}product/products/by_vendor/${vendorId}/`
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
  if (context === undefined || null) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
