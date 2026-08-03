// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NotFound from '../src/views/NotFound';

describe('NotFound', () => {
  it('renders the 404 state and navigates home on click', () => {
    const onNavigate = vi.fn();
    render(<NotFound onNavigate={onNavigate} />);
    expect(screen.getByText('404 SEGMENTATION FAULT')).toBeTruthy();
    fireEvent.click(screen.getByText(/Reset Pointer Origin/i));
    expect(onNavigate).toHaveBeenCalledWith('/');
  });
});
