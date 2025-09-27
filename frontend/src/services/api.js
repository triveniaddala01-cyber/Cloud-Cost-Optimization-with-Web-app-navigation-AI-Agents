import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions for fetching data
export const fetchCostOverview = async () => {
  try {
    const response = await api.get('/cost-overview');
    return response.data;
  } catch (error) {
    console.error('Error fetching cost overview:', error);
    throw error;
  }
};

export const fetchCostTrends = async () => {
  try {
    const response = await api.get('/cost-trends');
    return response.data;
  } catch (error) {
    console.error('Error fetching cost trends:', error);
    throw error;
  }
};

export const fetchRecommendations = async () => {
  try {
    const response = await api.get('/recommendations');
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

export const fetchSavingsByResource = async () => {
  try {
    const response = await api.get('/savings-by-resource');
    return response.data;
  } catch (error) {
    console.error('Error fetching savings by resource:', error);
    throw error;
  }
};

export const fetchProjectedCost = async () => {
  try {
    const response = await api.get('/projected-cost');
    return response.data;
  } catch (error) {
    console.error('Error fetching projected cost:', error);
    throw error;
  }
};

// Function to apply a recommendation
export const applyRecommendation = async (recommendationId) => {
  try {
    const response = await api.post(`/recommendations/${recommendationId}/apply`);
    return response.data;
  } catch (error) {
    console.error('Error applying recommendation:', error);
    throw error;
  }
};
export default api;
