// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from "react";
// import axios from "axios";
// import { Role, User } from "types/user";
// import { API_BASE_URL } from "@env";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Alert, } from "react-native";
// import { useNavigation } from "@react-navigation/native";


// interface AuthProviderProps {
//   children: ReactNode;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<boolean>;
//   logout: () => void;
//   addPaypalAddress: (paypalAddress: string) => Promise<boolean>;
//   isLoggedIn: boolean;
//   loadUserDetails: (accessToken: string) => Promise<void>;
//   register: (
//     email: string,
//     username: string,
//     password: string,
//     confirmPassword: string,
//     role: Role
//   ) => Promise<boolean>;
// }


// const AuthContext = createContext<AuthContextType | null>(null);

// // const navigation = useNavigation()
// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }

// export function AuthProvider({ children }: AuthProviderProps) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [role, setRole] = useState<Role | null>(null);

//   useEffect(() => {
//     if (!user) {
//       initializeAuth();

//     }
//   }, []);

//   const apiClient = axios.create({
//     baseURL: API_BASE_URL,
//   });

//   apiClient.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       const originalRequest = error.config;
//       if (error.response?.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;
//         try {
//           await refreshToken();
//           return apiClient(originalRequest);
//         } catch (refreshError) {
//           handleReauthentication();
//           return Promise.reject(refreshError);
//         }
//       }
//       return Promise.reject(error);
//     }
//   );

//   const handleReauthentication = () => {
//     setUser(null);
//     AsyncStorage.removeItem("access");
//     AsyncStorage.removeItem("refresh");
//     // navigation.navigate("AuthScreen" as never);
//   };

//   useEffect(() => {
//     initializeAuth();

//     const intervalId = setInterval(async () => {
//       const accessToken = await AsyncStorage.getItem("access");
//       if (accessToken && isTokenExpired(accessToken)) {
//         refreshToken();
//       }
//     }, 55000); // შევცვალე დრო 55 წამზე

//     return () => clearInterval(intervalId);
//   }, []);

//   const initializeAuth = async () => {
//     const accessToken = await AsyncStorage.getItem("access");
//     if (accessToken && isTokenExpired(accessToken)) {
//       try {
//         await refreshToken();
//       } catch (error) {
//         console.error("Token refresh failed:", error);
//         await AsyncStorage.removeItem("access");
//         setIsLoggedIn(false);
//       }
//     } else if (accessToken) {
//       loadUserDetails(accessToken);
//     }
//     setLoading(false);
//   };


//   function isTokenExpired(token: string) {
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return payload.exp * 1000 < Date.now();
//   }

//   const refreshToken = async () => {
//     const refreshTokenValue = await AsyncStorage.getItem("refresh"); // await უნდა დაემატოს აქ
//     if (!refreshTokenValue) {
//       handleReauthentication();
//       return;
//     }
//     try {
//       const response = await apiClient.post(`${API_BASE_URL}user/token/refresh/`, {
//         refresh: refreshTokenValue,
//       });
//       const newAccessToken = response.data.access;
//       await AsyncStorage.setItem("access", newAccessToken);
//       apiClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
//       loadUserDetails(newAccessToken);
//       setIsLoggedIn(true);
//     } catch (error) {
//       handleReauthentication();
//     }
//   };

//   const loadUserDetails = async (accessToken: string) => {
//     try {
//       const userDetailsResponse = await apiClient.get(`${API_BASE_URL}user/detail/`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//       setUser(userDetailsResponse.data);
//       console.log("User details:", userDetailsResponse.data);
//       setIsLoggedIn(true);
//       if (userDetailsResponse.data.role === "CONSUMER") {
//         setIsLoggedIn(true);
//       }
//       // setIsLoggedIn(true);
//     } catch (error) {
//       handleReauthentication();
//     }
//   };

//   const register = async (
//     email: any,
//     password: any,
//     confirmPassword: any,
//     username: any,
//     role: any
//   ) => {
//     if (password !== confirmPassword) {
//       console.error("Passwords do not match");
//       return false;
//     }

//     try {
//       await apiClient.post(`${API_BASE_URL}user/register/`, {
//         email,
//         username,
//         password,
//         password2: confirmPassword,
//         role: 'CONSUMER',
//       });
//       return true;
//     } catch (error) {
//       console.error("Registration error:", error);
//       return false;
//     }
//   };

//   const login = async (
//     username: string,
//     password: string
//   ): Promise<boolean> => {
//     setLoading(true);
//     try {
//       const loginResponse = await apiClient.post(`${API_BASE_URL}user/token/`, {
//         username,
//         password,
//       });
//       AsyncStorage.setItem("access", loginResponse.data.access);
//       AsyncStorage.setItem("refresh", loginResponse.data.refresh);

//       await loadUserDetails(loginResponse.data.access);
//       setLoading(false);
//       return true;
//     } catch (error) {
//       console.error("Login error:", error);
//       setLoading(false);
//       return false;
//     }
//   };

//   const logoutConfirmation = async () => {
//     await AsyncStorage.removeItem("access"); // ტოკენების წაშლა
//     await AsyncStorage.removeItem("refresh");
//     console.log("User logged out, access token:", await AsyncStorage.getItem("access"));
//     setUser(null);
//     setIsLoggedIn(false);
//   };

//   const logout = () => {
//     console.log("is working");
//     logoutConfirmation();
//   };



//   const addPaypalAddress = async (paypalAddress: string) => {
//     try {
//       const accessToken = AsyncStorage.getItem("access");
//       if (accessToken) {
//         const response = await apiClient.post(
//           `${API_BASE_URL}user/update-paypal-address/`,
//           { paypal_address: paypalAddress },
//           {
//             headers: { Authorization: `Bearer ${accessToken}` },
//           }
//         );
//         setUser((prevUser) => prevUser ? {
//           ...prevUser,
//           paypal_address: response.data.paypal_address,
//         } : null);
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error("Error adding PayPal address:", error);
//       return false;
//     }
//   };

//   const value = {
//     user,
//     loading,
//     login,
//     logout,
//     addPaypalAddress,
//     isLoggedIn,
//     register,
//     role,
//     loadUserDetails
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
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
  logout: () => void;
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

      // Set the device_id in Axios headers
      // apiClient.defaults.headers.common["Device-ID"] = deviceId;

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



  const logout = async () => {
    await AsyncStorage.removeItem("device_id"); // Clear device_id on logout
    setUser(null);
    setIsLoggedIn(false);
    console.log("User logged out");
  };

  const value = {
    user,
    loading,
    initializeUser,
    logout,
    isLoggedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
