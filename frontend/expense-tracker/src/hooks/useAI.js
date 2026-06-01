import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

/**
 * Hook to generate AI monthly summary
 */
export const useAISummary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);

  const generateSummary = async () => {
    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const response = await axiosInstance.get(
        API_PATHS.AI.MONTHLY_SUMMARY
      );

      if (response.data) {
        setSummary(response.data);
        return response.data;
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to generate summary";
      setError(errorMsg);
      console.error("Error generating summary:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    summary,
    generateSummary,
  };
};

/**
 * Hook to auto-categorize an expense description
 */
export const useAutoCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categorizeDescription = async (description) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(
        API_PATHS.AI.CATEGORIZE_EXPENSE,
        { description }
      );

      if (response.data && response.data.category) {
        return response.data.category;
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to categorize expense";
      setError(errorMsg);
      console.error("Error categorizing expense:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    categorizeDescription,
  };
};
