// Shared types matching the backend API

export type TransactionType = 'credit' | 'debit';

export interface Transaction {
  type: TransactionType;
  amount: number;
}

export interface CalculateBalanceRequest {
  initialBalance: number;
  transactions: Transaction[];
}

export interface CalculateBalanceResponse {
  finalBalance: number;
  status: 1 | 2; // 1 = normal, 2 = overdraft
}

export interface HealthResponse {
  status: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
  details?: unknown;
}

