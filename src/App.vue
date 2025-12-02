<template>
  <div class="app-container">
    <h1>Account Balance Calculator</h1>

    <form @submit.prevent="handleSubmit">
      <!-- Initial Balance Input -->
      <div class="form-group">
        <label for="initialBalance">Initial Balance</label>
        <input
          id="initialBalance"
          v-model.number="initialBalance"
          type="number"
          step="0.01"
          required
          placeholder="Enter initial balance"
        />
      </div>

      <!-- Transactions Section -->
      <div class="transactions-section">
        <div class="transactions-header">
          <h2>Transactions</h2>
          <button
            type="button"
            class="btn btn-secondary"
            @click="addTransaction"
          >
            + Add Transaction
          </button>
        </div>

        <div v-if="transactions.length === 0" class="empty-state">
          <p>No transactions added yet. Click "Add Transaction" to get started.</p>
        </div>

        <div
          v-for="(transaction, index) in transactions"
          :key="index"
          class="transaction-item"
        >
          <div class="form-group">
            <label>Type</label>
            <select v-model="transaction.type" required>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
          </div>
          <div class="form-group">
            <label>Amount</label>
            <input
              v-model.number="transaction.amount"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="Enter amount"
            />
          </div>
          <button
            type="button"
            class="btn btn-danger remove-btn"
            @click="removeTransaction(index)"
          >
            Remove
          </button>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="submit-section">
        <button
          type="submit"
          class="btn btn-primary submit-btn"
          :disabled="loading || transactions.length === 0"
        >
          {{ loading ? 'Calculating...' : 'Calculate Balance' }}
        </button>
      </div>
    </form>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      Processing your request...
    </div>

    <!-- Results Section -->
    <div v-if="result && !loading" class="results-section">
      <h2>Results</h2>

      <div class="result-card">
        <div class="result-row">
          <span class="result-label">Final Balance:</span>
          <span
            class="result-value"
            :class="{
              'balance-positive': result.finalBalance >= 0,
              'balance-negative': result.finalBalance < 0
            }"
          >
            {{ formatCurrency(result.finalBalance) }}
          </span>
        </div>
        <div class="result-row">
          <span class="result-label">Status:</span>
          <span
            class="status-badge"
            :class="{
              'status-normal': result.status === 1,
              'status-overdraft': result.status === 2
            }"
          >
            {{ result.status === 1 ? 'Normal' : 'Overdraft' }}
          </span>
        </div>
      </div>

      <!-- Overdraft Warning -->
      <div v-if="result.status === 2" class="overdraft-warning">
        <h3>⚠️ Overdraft Alert</h3>
        <p>Account credit allows a loan up to: 10000 USD</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { calculateBalance } from './api';
import type { Transaction, CalculateBalanceResponse } from './types';

const initialBalance = ref<number>(0);
const transactions = ref<Transaction[]>([]);
const result = ref<CalculateBalanceResponse | null>(null);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

const addTransaction = (): void => {
  transactions.value.push({
    type: 'credit',
    amount: 0
  });
};

const removeTransaction = (index: number): void => {
  transactions.value.splice(index, 1);
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const handleSubmit = async (): Promise<void> => {
  error.value = null;
  result.value = null;
  loading.value = true;

  try {
    // Validate transactions
    const validTransactions = transactions.value.filter(
      (t) => t.amount > 0
    );

    if (validTransactions.length === 0) {
      throw new Error('Please add at least one transaction with a positive amount');
    }

    const response = await calculateBalance(
      initialBalance.value,
      validTransactions
    );

    result.value = response;
  } catch (err) {
    error.value = err instanceof Error 
      ? err.message 
      : 'An error occurred while calculating the balance';
  } finally {
    loading.value = false;
  }
};
</script>
