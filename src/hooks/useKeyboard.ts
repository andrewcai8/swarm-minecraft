import { useEffect, useRef } from 'react';

/**
 * Hook for tracking keyboard input state.
 *
 * Returns a stable Map reference where keys are keyboard codes (e.g., 'KeyW', 'Space')
 * and values are booleans indicating whether the key is currently pressed.
 *
 * Tracks WASD (KeyW, KeyA, KeyS, KeyD), Space (jump), E (inventory), and digit keys 1-9.
 * The Map updates in response to window keydown/keyup events.
 *
 * @returns Stable Map reference with current key states
 *
 * @example
 * ```tsx
 * const keys = useKeyboard();
 * if (isKeyPressed(keys, 'KeyW')) {
 *   // Move forward
 * }
 * ```
 */
export function useKeyboard(): Map<string, boolean> {
  const keysRef = useRef<Map<string, boolean>>(new Map());

  useEffect(() => {
    /**
     * Handles keydown events, setting the key state to true.
     */
    const handleKeyDown = (event: KeyboardEvent): void => {
      keysRef.current.set(event.code, true);
    };

    /**
     * Handles keyup events, setting the key state to false.
     */
    const handleKeyUp = (event: KeyboardEvent): void => {
      keysRef.current.set(event.code, false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keysRef.current;
}

/**
 * Helper function to check if a key is currently pressed.
 *
 * @param keys - Map of key states from useKeyboard hook
 * @param key - Key code to check (e.g., 'KeyW', 'Space', 'Digit1')
 * @returns true if the key is pressed, false otherwise
 *
 * @example
 * ```tsx
 * const keys = useKeyboard();
 * if (isKeyPressed(keys, 'Space')) {
 *   player.jump();
 * }
 * ```
 */
export function isKeyPressed(keys: Map<string, boolean>, key: string): boolean {
  return keys.get(key) === true;
}
