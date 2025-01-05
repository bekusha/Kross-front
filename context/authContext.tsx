import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { Role, User } from "types/user";
import { API_BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, } from "react-native";
import { useNavigation } from "@react-navigation/native";


interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addPaypalAddress: (paypalAddress: string) => Promise<boolean>;
  isLoggedIn: boolean;
  loadUserDetails: (accessToken: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string,
    confirmPassword: string,
    role: Role
  ) => Promise<boolean>;
}


const AuthContext = createContext<AuthContextType | null>(null);

// const navigation = useNavigation()
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    if (!user) {
      initializeAuth();

    }
  }, []);

  const apiClient = axios.create({
    baseURL: API_BASE_URL,
  });

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await refreshToken();
          return apiClient(originalRequest);
        } catch (refreshError) {
          handleReauthentication();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  const handleReauthentication = () => {
    setUser(null);
    AsyncStorage.removeItem("access");
    AsyncStorage.removeItem("refresh");
    // navigation.navigate("AuthScreen" as never);
  };

  useEffect(() => {
    initializeAuth();

    const intervalId = setInterval(async () => {
      const accessToken = await AsyncStorage.getItem("access");
      if (accessToken && isTokenExpired(accessToken)) {
        refreshToken();
      }
    }, 55000); // შევცვალე დრო 55 წამზე

    return () => clearInterval(intervalId);
  }, []);

  const initializeAuth = async () => {
    const accessToken = await AsyncStorage.getItem("access");
    if (accessToken && isTokenExpired(accessToken)) {
      try {
        await refreshToken();
      } catch (error) {
        console.error("Token refresh failed:", error);
        await AsyncStorage.removeItem("access");
        setIsLoggedIn(false);
      }
    } else if (accessToken) {
      loadUserDetails(accessToken);
    }
    setLoading(false);
  };


  function isTokenExpired(token: string) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  }

  const refreshToken = async () => {
    const refreshTokenValue = await AsyncStorage.getItem("refresh"); // await უნდა დაემატოს აქ
    if (!refreshTokenValue) {
      handleReauthentication();
      return;
    }
    try {
      const response = await apiClient.post(`${API_BASE_URL}user/token/refresh/`, {
        refresh: refreshTokenValue,
      });
      const newAccessToken = response.data.access;
      await AsyncStorage.setItem("access", newAccessToken);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
      loadUserDetails(newAccessToken);
      setIsLoggedIn(true);
    } catch (error) {
      handleReauthentication();
    }
  };

  const loadUserDetails = async (accessToken: string) => {
    try {
      const userDetailsResponse = await apiClient.get(`${API_BASE_URL}user/detail/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUser(userDetailsResponse.data);
      console.log("User details:", userDetailsResponse.data);
      setIsLoggedIn(true);
      if (userDetailsResponse.data.role === "CONSUMER") {
        setIsLoggedIn(true);
      }
      // setIsLoggedIn(true);
    } catch (error) {
      handleReauthentication();
    }
  };

  const register = async (
    email: any,
    password: any,
    confirmPassword: any,
    username: any,
    role: any
  ) => {
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return false;
    }

    try {
      await apiClient.post(`${API_BASE_URL}user/register/`, {
        email,
        username,
        password,
        password2: confirmPassword,
        role: 'CONSUMER',
      });
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const loginResponse = await apiClient.post(`${API_BASE_URL}user/token/`, {
        username,
        password,
      });
      AsyncStorage.setItem("access", loginResponse.data.access);
      AsyncStorage.setItem("refresh", loginResponse.data.refresh);

      await loadUserDetails(loginResponse.data.access);
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      return false;
    }
  };

  const logoutConfirmation = async () => {
    await AsyncStorage.removeItem("access"); // ტოკენების წაშლა
    await AsyncStorage.removeItem("refresh");
    console.log("User logged out, access token:", await AsyncStorage.getItem("access"));
    setUser(null);
    setIsLoggedIn(false);
  };

  const logout = () => {
    console.log("is working");
    logoutConfirmation();
  };



  const addPaypalAddress = async (paypalAddress: string) => {
    try {
      const accessToken = AsyncStorage.getItem("access");
      if (accessToken) {
        const response = await apiClient.post(
          `${API_BASE_URL}user/update-paypal-address/`,
          { paypal_address: paypalAddress },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setUser((prevUser) => prevUser ? {
          ...prevUser,
          paypal_address: response.data.paypal_address,
        } : null);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding PayPal address:", error);
      return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    addPaypalAddress,
    isLoggedIn,
    register,
    role,
    loadUserDetails
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
