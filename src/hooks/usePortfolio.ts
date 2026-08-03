import { useState, useEffect, createContext, useContext } from 'react';
import { DBStructure } from '../types';

interface PortfolioContextType {
  data: DBStructure | null;
  loading: boolean;
  refresh: () => Promise<void>;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const PortfolioContext = createContext<PortfolioContextType>({
  data: null,
  loading: true,
  refresh: async () => {},
  theme: 'dark',
  toggleTheme: () => {},
});

export function usePortfolio() {
  return useContext(PortfolioContext);
}
