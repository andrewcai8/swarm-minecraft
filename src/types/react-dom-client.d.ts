declare module 'react-dom/client' {
  import { Container } from 'react-dom';

  export interface Root {
    render(children: React.ReactNode): void;
    unmount(): void;
  }

  export function createRoot(
    container: Container,
    options?: {
      onRecoverableError?: (error: unknown) => void;
    }
  ): Root;
}
