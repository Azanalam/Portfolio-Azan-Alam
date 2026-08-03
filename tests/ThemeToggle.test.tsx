// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../src/components/ThemeToggle';
import { PortfolioContext } from '../src/hooks/usePortfolio';

describe('ThemeToggle', () => {
  it('reflects the current theme and triggers toggleTheme on click', () => {
    const toggleTheme = vi.fn();
    render(
      <PortfolioContext.Provider
        value={{ data: null, loading: false, refresh: async () => {}, theme: 'dark', toggleTheme }}
      >
        <ThemeToggle />
      </PortfolioContext.Provider>
    );

    const button = screen.getByRole('switch');
    expect(button.getAttribute('aria-checked')).toBe('true');

    fireEvent.click(button);
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });
});
