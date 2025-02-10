
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import { API_BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import DeviceInfo from 'react-native-device-info';
import * as Device from 'expo-device';
import axiosInstance from "./axiosInstance";
import { User } from "@/types/user";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  user: User | null; // Adjust based on your User type definition
  loading: boolean;
  initializeUser: (deviceId: string) => Promise<boolean>;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    setLoading(true);

    try {
      // Retrieve device_id from AsyncStorage
      let deviceId: string | null = await AsyncStorage.getItem("device_id");

      // If device_id is null, generate a new one
      if (!deviceId) {
        deviceId = Device.osBuildId || Device.modelId || 'Default-Device-ID';
        console.log("Generated Device ID:", deviceId);
        await AsyncStorage.setItem("device_id", deviceId!); // Save the new device_id
      }



      // Use the device_id to initialize the user
      const success = deviceId ? await initializeUser(deviceId) : false; // Ensure deviceId is not null
      setIsLoggedIn(success);
    } catch (error) {
      console.error("Error initializing auth:", error);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };




  const initializeUser = async (deviceId: string): Promise<boolean> => {
    try {
      // Send device_id to the server
      const response = await axiosInstance.post(`/user/create-consumer/${deviceId}/`);

      // Save the user details
      console.log("User details:", response.data);
      setUser(response.data.user);

      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error("User initialization failed:", error);
      return false;
    }
  };


  const value = {
    user,
    loading,
    initializeUser,
    isLoggedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
