import { create } from 'zustand';

/**
 * Block type identifier stored in chunk data.
 * 0 represents air (empty block), 1-255 represent solid block types.
 */
export type BlockType = number;

/**
 * Chunk data stored as a flat Uint8Array.
 * Block types are indexed by local coordinates within the chunk.
 * Index formula: x + z * CHUNK_SIZE + y * CHUNK_SIZE * CHUNK_SIZE
 */
export type ChunkData = Uint8Array;

/**
 * World state interface defining the game store shape.
 */
export interface WorldState {
  /** Map of chunk data keyed by `${chunkX},${chunkZ}` */
  chunks: Map<string, ChunkData>;
  /** Random seed for terrain generation */
  seed: number;
  /** Player position as [x, y, z] world coordinates */
  playerPosition: [number, number, number];
  /**
   * Adds a new chunk to the world.
   * @param chunkX - Chunk X coordinate in chunk space
   * @param chunkZ - Chunk Z coordinate in chunk space
   * @param data - Chunk data containing block types
   */
  addChunk: (chunkX: number, chunkZ: number, data: ChunkData) => void;
  /**
   * Gets the block type at the given world coordinates.
   * @param x - World X coordinate
   * @param y - World Y coordinate
   * @param z - World Z coordinate
   * @returns Block type at position, or undefined if out of bounds or chunk missing
   */
  getBlock: (x: number, y: number, z: number) => BlockType | undefined;
  /**
   * Sets a block at the given world coordinates.
   * Creates the chunk if it doesn't exist.
   * @param x - World X coordinate
   * @param y - World Y coordinate
   * @param z - World Z coordinate
   * @param type - Block type to set
   */
  setBlock: (x: number, y: number, z: number, type: BlockType) => void;
  /**
   * Removes a block at the given world coordinates (sets to air/0).
   * @param x - World X coordinate
   * @param y - World Y coordinate
   * @param z - World Z coordinate
   */
  removeBlock: (x: number, y: number, z: number) => void;
  /**
   * Sets the player position.
   * @param position - New player position as [x, y, z]
   */
  setPlayerPosition: (position: [number, number, number]) => void;
}

/** Horizontal size of a chunk in blocks */
const CHUNK_SIZE = 16;

/** Vertical height of a chunk in blocks */
const CHUNK_HEIGHT = 256;

/**
 * Generates the chunk key from chunk coordinates.
 * @param chunkX - Chunk X coordinate
 * @param chunkZ - Chunk Z coordinate
 * @returns String key in format `${chunkX},${chunkZ}`
 */
function getChunkKey(chunkX: number, chunkZ: number): string {
  return `${chunkX},${chunkZ}`;
}

/**
 * Converts world X coordinate to chunk X coordinate.
 */
function worldToChunkX(worldX: number): number {
  return Math.floor(worldX / CHUNK_SIZE);
}

/**
 * Converts world Z coordinate to chunk Z coordinate.
 */
function worldToChunkZ(worldZ: number): number {
  return Math.floor(worldZ / CHUNK_SIZE);
}

/**
 * Converts world coordinate to local chunk coordinate.
 */
function worldToLocal(worldCoord: number): number {
  const local = worldCoord % CHUNK_SIZE;
  return local < 0 ? local + CHUNK_SIZE : local;
}

/**
 * Calculates the array index for a local position within a chunk.
 */
function getBlockIndex(localX: number, y: number, localZ: number): number {
  return localX + localZ * CHUNK_SIZE + y * CHUNK_SIZE * CHUNK_SIZE;
}

/**
 * Creates a new empty chunk data array filled with air (0).
 */
function createEmptyChunkData(): ChunkData {
  return new Uint8Array(CHUNK_SIZE * CHUNK_SIZE * CHUNK_HEIGHT);
}

/**
 * Zustand store for world state management.
 * Manages chunks, blocks, and player position.
 */
export const useGameStore = create<WorldState>((set, get) => ({
  chunks: new Map<string, ChunkData>(),
  seed: Date.now(),
  playerPosition: [0, 64, 0],

  addChunk: (chunkX: number, chunkZ: number, data: ChunkData): void => {
    const key = getChunkKey(chunkX, chunkZ);
    set((state) => {
      const newChunks = new Map(state.chunks);
      newChunks.set(key, data);
      return { chunks: newChunks };
    });
  },

  getBlock: (x: number, y: number, z: number): BlockType | undefined => {
    const { chunks } = get();

    // Check Y bounds
    if (y < 0 || y >= CHUNK_HEIGHT) {
      return undefined;
    }

    const chunkX = worldToChunkX(x);
    const chunkZ = worldToChunkZ(z);
    const key = getChunkKey(chunkX, chunkZ);

    const chunkData = chunks.get(key);
    if (!chunkData) {
      return undefined;
    }

    const localX = worldToLocal(x);
    const localZ = worldToLocal(z);
    const index = getBlockIndex(localX, y, localZ);

    return chunkData[index];
  },

  setBlock: (x: number, y: number, z: number, type: BlockType): void => {
    // Check Y bounds
    if (y < 0 || y >= CHUNK_HEIGHT) {
      return;
    }

    const chunkX = worldToChunkX(x);
    const chunkZ = worldToChunkZ(z);
    const key = getChunkKey(chunkX, chunkZ);

    set((state) => {
      const newChunks = new Map(state.chunks);
      let chunkData = newChunks.get(key);

      // Create chunk if it doesn't exist
      if (!chunkData) {
        chunkData = createEmptyChunkData();
        newChunks.set(key, chunkData);
      } else {
        // Clone the chunk data to maintain immutability
        chunkData = new Uint8Array(chunkData);
        newChunks.set(key, chunkData);
      }

      const localX = worldToLocal(x);
      const localZ = worldToLocal(z);
      const index = getBlockIndex(localX, y, localZ);

      chunkData[index] = type;

      return { chunks: newChunks };
    });
  },

  removeBlock: (x: number, y: number, z: number): void => {
    const { setBlock } = get();
    setBlock(x, y, z, 0);
  },

  setPlayerPosition: (position: [number, number, number]): void => {
    set({ playerPosition: position });
  },
}));

/**
 * Selector for accessing chunks map.
 * Use this for performance when only chunks are needed.
 */
export const selectChunks = (state: WorldState): Map<string, ChunkData> =>
  state.chunks;

/**
 * Selector for accessing the seed.
 * Use this for performance when only seed is needed.
 */
export const selectSeed = (state: WorldState): number => state.seed;

/**
 * Selector for accessing player position.
 * Use this for performance when only player position is needed.
 */
export const selectPlayerPosition = (
  state: WorldState
): [number, number, number] => state.playerPosition;
