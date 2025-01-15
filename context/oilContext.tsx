import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import apiClient from "./axiosInstance"; // გამოიყენება axiosInstance
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

  // Updated endpoints to match your Django urlpatterns
  const endpoints = {
    list: `${API_BASE_URL}user/mileage/list/`,
    create: `${API_BASE_URL}user/mileage/create/`,
  };

  // Function to get oil records for the authenticated user
  const fetchOilRecords = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<OilRecord[]>(endpoints.list);
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
      const response = await apiClient.post<OilRecord>(endpoints.create, {
        current_mileage: currentMileage,
      });
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
      await apiClient.delete(endpoints.list);
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
      }}
    >
      {children}
    </OilContext.Provider>
  );
};
