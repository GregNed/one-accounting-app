import axios from 'axios';

// Use relative paths when using Vite proxy, or absolute URL for direct connection
const API_BASE_URL = import.meta.env.DEV ? '' : 'http://localhost:3000';

export const calculateBalance = async (initialBalance, transactions) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/calculate-balance`, {
      initialBalance: parseFloat(initialBalance),
      transactions: transactions.map(t => ({
        type: t.type,
        amount: parseFloat(t.amount)
      }))
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.error || 'Failed to calculate balance');
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Unable to connect to the server. Please make sure the backend is running.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
};

export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  } catch (error) {
    throw new Error('Backend server is not available');
  }
};

