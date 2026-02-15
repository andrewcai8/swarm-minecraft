import { create } from 'zustand';

/**
 * Represents a single block in the world.
 */
export interface Block {
  /** The block type identifier (e.g., 'grass', 'dirt', 'stone'). */
  type: string;
}

/**
 * Position key for a block, formatted as 'x,y,z'.
 */
export type BlockPosition = string;

/**
 * Game state for the world.
 */
export interface GameState {
  /** Map of block positions to block data. */
  blocks: Map<BlockPosition, Block>;
  /** Whether the game is paused. */
  isPaused: boolean;
  /** Current time of day (0-1, where 0 is dawn, 0.5 is dusk). */
  timeOfDay: number;
  /** Seed for terrain generation. */
  seed: number;
}

/**
 * Actions for modifying game state.
 */
export interface GameActions {
  /** Add or update a block at the given position. */
  setBlock: (x: number, y: number, z: number, type: string) => void;
  /** Remove a block at the given position. */
  removeBlock: (x: number, y: number, z: number) => void;
  /** Get a block at the given position. */
  getBlock: (x: number, y: number, z: number) => Block | undefined;
  /** Toggle pause state. */
  togglePause: () => void;
  /** Set the time of day. */
  setTimeOfDay: (time: number) => void;
  /** Reset the world with a new seed. */
  resetWorld: (seed?: number) => void;
}

/**
 * Complete game store type combining state and actions.
 */
export type GameStore = GameState & GameActions;

/**
 * Creates a position key from coordinates.
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param z - Z coordinate
 * @returns Position key string
 */
function positionKey(x: number, y: number, z: number): BlockPosition {
  return `${x},${y},${z}`;
}

/**
 * Zustand store for game world state.
 * Manages blocks, time, and game pause state.
 */
export const useGameStore = create<GameStore>((set, get) => ({
  blocks: new Map(),
  isPaused: false,
  timeOfDay: 0,
  seed: Math.random() * 10000,

  setBlock: (x: number, y: number, z: number, type: string) => {
    set((state) => {
      const newBlocks = new Map(state.blocks);
      newBlocks.set(positionKey(x, y, z), { type });
      return { blocks: newBlocks };
    });
  },

  removeBlock: (x: number, y: number, z: number) => {
    set((state) => {
      const newBlocks = new Map(state.blocks);
      newBlocks.delete(positionKey(x, y, z));
      return { blocks: newBlocks };
    });
  },

  getBlock: (x: number, y: number, z: number) => {
    return get().blocks.get(positionKey(x, y, z));
  },

  togglePause: () => {
    set((state) => ({ isPaused: !state.isPaused }));
  },

  setTimeOfDay: (time: number) => {
    set({ timeOfDay: Math.max(0, Math.min(1, time)) });
  },

  resetWorld: (seed?: number) => {
    set({
      blocks: new Map(),
      isPaused: false,
      timeOfDay: 0,
      seed: seed ?? Math.random() * 10000,
    });
  },
}));
