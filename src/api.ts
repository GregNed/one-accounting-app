import axios, { AxiosError } from 'axios';
import type {
  CalculateBalanceRequest,
  CalculateBalanceResponse,
  HealthResponse,
  Transaction
} from './types';

// Use relative paths when using Vite proxy, or absolute URL for direct connection
const API_BASE_URL = import.meta.env.DEV ? '' : 'http://localhost:3000';

export const calculateBalance = async (
  initialBalance: number,
  transactions: Transaction[]
): Promise<CalculateBalanceResponse> => {
  try {
    const request: CalculateBalanceRequest = {
      initialBalance: parseFloat(initialBalance.toString()),
      transactions: transactions.map(t => ({
        type: t.type,
        amount: parseFloat(t.amount.toString())
      }))
    };

    const response = await axios.post<CalculateBalanceResponse>(
      `${API_BASE_URL}/calculate-balance`,
      request
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ error?: string }>;
    
    if (error.response) {
      // Server responded with error status
      throw new Error(
        error.response.data?.error || 'Failed to calculate balance'
      );
    } else if (error.request) {
      // Request was made but no response received
      throw new Error(
        'Unable to connect to the server. Please make sure the backend is running.'
      );
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
};

export const checkHealth = async (): Promise<HealthResponse> => {
  try {
    const response = await axios.get<HealthResponse>(`${API_BASE_URL}/health`);
    return response.data;
  } catch (error) {
    throw new Error('Backend server is not available');
  }
};

