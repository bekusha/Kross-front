import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import { API_BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage დამატებულია

// Define types for the context state and functions
interface OilRecord {
  id: number;
  current_mileage: number;
  next_change_mileage: number;
  created_at: string;
}

interface OilContextType {
  oilRecords: OilRecord[];
  loading: boolean;
  error: string | null;
  fetchOilRecords: () => void;
  createOilRecord: (currentMileage: number) => void;
  deleteOilRecords: () => void;
}

// Default value for the context
const defaultValue: OilContextType = {
  oilRecords: [],
  loading: false,
  error: null,
  fetchOilRecords: () => { },
  createOilRecord: () => { },
  deleteOilRecords: () => { },
};

// Create the context with a default value
const OilContext = createContext<OilContextType>(defaultValue);

// Custom hook to use the context
export const useOil = () => useContext(OilContext);

// Context provider component with type for children prop
export const OilProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [oilRecords, setOilRecords] = useState<OilRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Base URL for your API (adjust this according to your server's base path)

  // Updated endpoints to match your Django urlpatterns
  const endpoints = {
    list: `${API_BASE_URL}user/mileage/list/`,
    create: `${API_BASE_URL}user/mileage/create/`,
  };

  // Function to get oil records for the authenticated user
  const fetchOilRecords = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("access"); // await დაემატა აქაც
      const response = await axios.get<OilRecord[]>(endpoints.list, {
        headers: {
          Authorization: `Bearer ${token}`, // Token გადაეცა
        },
      });
      setOilRecords(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to create a new oil record
  const createOilRecord = async (currentMileage: number) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("access"); // await დაემატა აქაც
      const response = await axios.post<OilRecord>(
        endpoints.create,
        { current_mileage: currentMileage },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token გადაეცა აქაც
          },
        }
      );
      setOilRecords([...oilRecords, response.data]);
      fetchOilRecords();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete all existing oil records
  const deleteOilRecords = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("access"); // await დაემატა აქაც
      await axios.delete(endpoints.list, {
        headers: {
          Authorization: `Bearer ${token}`, // Token გადაეცა აქაც
        },
      });
      setOilRecords([]); // Clear the records in the state
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OilContext.Provider
      value={{
        oilRecords,
        loading,
        error,
        fetchOilRecords,
        createOilRecord,
        deleteOilRecords,
      }}>
      {children}
    </OilContext.Provider>
  );
};
