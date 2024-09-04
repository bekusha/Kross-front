// AIContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import { API_BASE_URL } from "@env"; // Ensure this points to your backend API base URL

// Define types for AI responses and context
interface AIResponse {
  id: string;
  message: string;
}

interface AIContextType {
  aiResponses: AIResponse[];
  loading: boolean;
  error: string | null;
  fetchAIResponse: (prompt: string) => void;
  clearResponses: () => void;
}

// Default values for the context
const defaultValue: AIContextType = {
  aiResponses: [],
  loading: false,
  error: null,
  fetchAIResponse: () => {},
  clearResponses: () => {},
};

// Create the context
const AIContext = createContext<AIContextType>(defaultValue);

// Custom hook to use the AI context
export const useAI = () => useContext(AIContext);

// Context provider component with children prop type
export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [aiResponses, setAIResponses] = useState<AIResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // API endpoint for AI interactions (adjust according to your backend setup)
  const endpoint = `${API_BASE_URL}ai/oil/`; // Assuming this is the correct endpoint for AI responses

  // Function to fetch AI response based on user input
  const fetchAIResponse = async (prompt: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(endpoint, { car_model_year: prompt });
      const aiMessage = response.data.message;

      // Add the new AI response to the list
      setAIResponses((prevResponses) => [
        ...prevResponses,
        { id: Math.random().toString(), message: aiMessage },
      ]);
    } catch (err: any) {
      setError(
        err.response
          ? err.response.data
          : "An error occurred while fetching AI response."
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to clear AI responses
  const clearResponses = () => {
    setAIResponses([]);
  };

  return (
    <AIContext.Provider
      value={{
        aiResponses,
        loading,
        error,
        fetchAIResponse,
        clearResponses,
      }}>
      {children}
    </AIContext.Provider>
  );
};
