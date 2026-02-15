declare module 'react-dom/client' {
  import { Container } from 'react-dom';

  export function createRoot(
    container: Container,
    options?: {
      onRecoverableError?: (error: unknown) => void;
      identifierPrefix?: string;
      onCaughtError?: (error: unknown) => void;
      onUncaughtError?: (error: unknown) => void;
    }
  ): {
    render: (children: React.ReactNode) => void;
    unmount: () => void;
  };
}
