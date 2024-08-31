import { User } from "./user";

export interface Product {
  volume: string | undefined;
  id: number;
  vendor: any;
  name: string;
  description: string;
  price: number;
  createdAt: string;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  quantity?: number;
  viscosity: string;
  liter: number;
  category: Category;
}

export interface ProductContextType {
  products: Product[];
  categories: Category[];
  fetchProducts: () => Promise<Product[]>;
  fetchProductsByCategory: (categoryId: number) => Promise<Product[]>;
  addProduct: (productData: FormData, categoryId: number) => Promise<void>;
  editProduct: (productId: number, formData: FormData) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
  fetchProductsByVendor: (vendorId: number) => Promise<void>;
}

export interface Category {
  id: number;
  name: string;
  parent?: number | null;
}

export interface NewProductData {
  name: string;
  description: string;
  price: number;
  // Include types for your images if they are being sent as part of the form data
  image1?: File | null;
  image2?: File | null;
  image3?: File | null;
  image4?: File | null;
  image5?: File | null;
}
