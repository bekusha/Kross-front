import axios, { AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_BASE_URL } from "@env";



// Axios instance შექმნა
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL, 
  timeout: 20000, 
});

// Interceptor-ი Device-ID-ის დასამატებლად
apiClient.interceptors.request.use(
  async (config) => {
    const deviceId = await AsyncStorage.getItem("device_id");
    if (deviceId && config.headers) {
      apiClient.defaults.headers.common["Device-ID"] = deviceId;
      config.headers.set("Device-ID", deviceId);
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Interceptor-ი პასუხის დამუშავებისთვის
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response error:", error.response || error);
    console.log("Error response:", error.response);
    return Promise.reject(error);
  }
);

export default apiClient;
