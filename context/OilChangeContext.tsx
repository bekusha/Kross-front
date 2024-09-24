import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

// API URL, დარწმუნდით, რომ თქვენი URL სწორია და შეიცავს თქვენს Backend-ის მისამართს.
import { API_BASE_URL } from "@env";
import { useAuth } from "./authContext";

// Define types for delivery data
interface OilChangeDelivery {
  id: number;
  user: number;
  phone: string;
  address: string;
  email: string;
  product: number;
  message: string;
  ordered_at: string;
}

// Define context type
interface OilChangeContextType {
  deliveries: OilChangeDelivery[];
  loading: boolean;
  error: string | null;
  fetchDeliveries: () => Promise<void>;
  createDelivery: (deliveryData: Partial<OilChangeDelivery>) => Promise<void>;
}

// Create context with default values
const OilChangeContext = createContext<OilChangeContextType | undefined>(
  undefined
);

// Define provider props
interface OilChangeProviderProps {
  children: ReactNode;
}

// კონტექსტის პროვაიდერი
export const OilChangeProvider: React.FC<OilChangeProviderProps> = ({
  children,
}) => {
  const [deliveries, setDeliveries] = useState<OilChangeDelivery[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();

  // ფუნქცია ყველა ჩანაწერის მისაღებად
  // ფუნქცია ყველა ჩანაწერის მისაღებად
  const fetchDeliveries = async () => {
    console.log('is working')
    if (!isLoggedIn) {
      console.warn("User is not logged in, aborting fetch");
      return; // Exit if the user is not logged in
    }
    setLoading(true);
    const token = localStorage.getItem("access");
    if (!token) {
      setError("No access token found");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get<OilChangeDelivery[]>(
        `${API_BASE_URL}changedelivery/user-orders/`, // Adjust API endpoint
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure the token is correct
          },
        }
      );
      console.log("Fetched deliveries:", response.data);
      setDeliveries(response.data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching deliveries:", err.response || err.message);
      setError(err.response?.data?.message || err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };


  const checkNewApi = () => {
    const response = axios.get(`${API_BASE_URL}user/`);
    console.log(response);
  };

  // ფუნქცია ახალი ჩანაწერის შესაქმნელად
  const createDelivery = async (deliveryData: Partial<OilChangeDelivery>) => {
    console.log(deliveryData)
    setLoading(true);
    try {
      const response = await axios.post<OilChangeDelivery>(
        `${API_BASE_URL}changedelivery/`,
        deliveryData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      setDeliveries((prev) => [...prev, response.data]);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries(); // თავდაპირველად ყველა ჩანაწერის ჩატვირთვა
  }, []);

  return (
    <OilChangeContext.Provider
      value={{
        deliveries,
        loading,
        error,
        fetchDeliveries,
        createDelivery,
      }}>
      {children}
    </OilChangeContext.Provider>
  );
};

// Hook კონტექსტის მარტივად გამოსაყენებლად
export const useOilChange = (): OilChangeContextType => {
  const context = useContext(OilChangeContext);
  if (context === undefined) {
    throw new Error("useOilChange must be used within an OilChangeProvider");
  }
  return context;
};
