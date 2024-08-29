// // context/OilContext.tsx
// import React, {
//   createContext,
//   useState,
//   useContext,
//   useEffect,
//   ReactNode,
// } from "react";
// import axios from "axios";
// import { Product } from "@/types/product";

// // Define types for Product and Category

// interface Category {
//   id: number;
//   name: string;
//   parent?: number;
// }

// // Define types for the context state
// interface OilContextState {
//   products: Product[];
//   categories: Category[];
//   loading: boolean;
//   error: string | null;
//   createProduct: (productData: Partial<Product>) => Promise<void>;
// }

// // Create the context with a default value
// const OilContext = createContext<OilContextState | undefined>(undefined);

// interface OilProviderProps {
//   children: ReactNode;
// }

// // Create a provider component
// export const OilProvider: React.FC<OilProviderProps> = ({ children }) => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // Fetch products and categories on mount
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const [productsResponse, categoriesResponse] = await Promise.all([
//           axios.get<Product[]>(
//             `${process.env.NEXT_PUBLIC_API_BASE_URL}product`
//           ),
//           axios.get<Category[]>(
//             `${process.env.NEXT_PUBLIC_API_BASE_URL}categories/`
//           ),
//         ]);
//         setProducts(productsResponse.data);
//         setCategories(categoriesResponse.data);
//         setLoading(false);
//       } catch (err: any) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const createProduct = async (productData: Partial<Product>) => {
//     try {
//       const response = await axios.post<Product>(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}products/`,
//         productData
//       );
//       setProducts([...products, response.data]);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const value = {
//     products,
//     categories,
//     loading,
//     error,
//     createProduct,
//   };

//   return <OilContext.Provider value={value}>{children}</OilContext.Provider>;
// };

// // Create a custom hook to use the OilContext
// export const useOil = (): OilContextState => {
//   const context = useContext(OilContext);
//   if (context === undefined) {
//     throw new Error("useOil must be used within an OilProvider");
//   }
//   return context;
// };
