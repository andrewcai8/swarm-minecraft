declare module 'react-dom/client' {
  import { Container } from 'react-dom';

  export function createRoot(
    container: Container,
    options?: RootOptions
  ): Root;

  export interface RootOptions {
    onRecoverableError?: (error: unknown) => void;
    identifierPrefix?: string;
    onCaughtError?: (error: unknown) => void;
    onUncaughtError?: (error: unknown) => void;
  }

  export interface Root {
    render(children: React.ReactNode): void;
    unmount(): void;
  }
}
