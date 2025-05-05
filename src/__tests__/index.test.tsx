import { render, screen } from '@testing-library/react';
import Index from '../app/page';

describe('Home', () => {
  it('renders without errors', () => {
    const { container } = render(<Index />);
    expect(container).toBeDefined();
  });
});