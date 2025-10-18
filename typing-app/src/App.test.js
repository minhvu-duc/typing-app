import { render, screen } from '@testing-library/react';
import App from './App';

test('renders typing speed test', () => {
  render(<App />);
  const linkElement = screen.getByText(/Typing Speed Test/i);
  expect(linkElement).toBeInTheDocument();
});
