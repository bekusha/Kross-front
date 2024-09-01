import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { User } from "types/user";
import { API_BASE_URL } from "@env";

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
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const apiClient = axios.create({
    baseURL: API_BASE_URL,
  });

  let isRefreshing = false;
  let failedQueue = [];

  apiClient.interceptors.response.use(
    (response) => response, // Just return the response if it's successful
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await refreshToken();
          return apiClient(originalRequest); // Retry the original request with the refreshed token
        } catch (refreshError) {
          handleReauthentication();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  const handleReauthentication = () => {
    // Clear user state and redirect to login or show login modal
    setUser(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/login"; // Adjust as needed for your application
  };

  useEffect(() => {
    initializeAuth();

    const intervalId = setInterval(() => {
      const accessToken = localStorage.getItem("access");
      if (accessToken && isTokenExpired(accessToken)) {
        refreshToken(); // Call refreshToken if the token has expired
      }
    }, 35000); // Refresh every 55 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  const initializeAuth = async () => {
    const accessToken = localStorage.getItem("access");
    if (accessToken && isTokenExpired(accessToken)) {
      // Access token is expired, attempt to refresh
      try {
        await refreshToken();
      } catch (error) {
        console.error("Token refresh failed:", error);
        localStorage.removeItem("access");
      }
    } else if (accessToken) {
      loadUserDetails(accessToken);
    }
    setLoading(false);
  };

  function isTokenExpired(token: string) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now(); // Ensure time units are consistent
  }

  // Enhanced refreshToken function with user details update

  const refreshToken = async () => {
    const refreshTokenValue = localStorage.getItem("refresh");
    if (!refreshTokenValue) {
      console.error("No refresh token available");
      handleReauthentication(); // handle re-authentication logic
      return;
    }
    try {
      const response = await apiClient.post(
        `${API_BASE_URL}user/token/refresh/`,
        { refresh: refreshTokenValue }
      );
      const newAccessToken = response.data.access;
      localStorage.setItem("access", newAccessToken);
      apiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${newAccessToken}`;
    } catch (error) {
      console.error("Token refresh failed:", error);
      handleReauthentication();
    }
  };

  const loadUserDetails = async (accessToken: string) => {
    try {
      const userDetailsResponse = await axios.get(
        `${API_BASE_URL}user/detail/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setUser(userDetailsResponse.data);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      localStorage.removeItem("access");
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const loginResponse = await axios.post(`${API_BASE_URL}user/token/`, {
        username,
        password,
      });
      localStorage.setItem("access", loginResponse.data.access);
      localStorage.setItem("refresh", loginResponse.data.refresh);

      const userDetailsResponse = await axios.get(
        `${API_BASE_URL}user/detail/`,
        {
          headers: { Authorization: `Bearer ${loginResponse.data.access}` },
        }
      );
      setIsLoggedIn(true);
      setUser(userDetailsResponse.data);
      setLoading(false);
      return true; // Login was successful
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      return false; // Login failed
    }
  };

  const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
  };

  const addPaypalAddress = async (paypalAddress: string) => {
    try {
      const accessToken = localStorage.getItem("access");
      if (accessToken) {
        const response = await axios.post(
          `${API_BASE_URL}user/update-paypal-address/`,
          { paypal_address: paypalAddress },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        // Update the user state with the updated PayPal address
        setUser((prevUser) => {
          if (prevUser) {
            return {
              ...prevUser,
              paypal_address: response.data.paypal_address,
            };
          }
          return null;
        });
        return true; // Adding PayPal address was successful
      }
      return false; // No access token found
    } catch (error) {
      console.error("Error adding PayPal address:", error);
      return false; // Adding PayPal address failed
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    addPaypalAddress,
    isLoggedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
