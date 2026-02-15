/**
 * Game constants for Minecraft Browser Edition.
 * All constants are typed and exported for use throughout the codebase.
 */

// =============================================================================
// World Generation Constants
// =============================================================================

/** The horizontal size of each chunk in blocks. */
export const CHUNK_SIZE: number = 16;

/** The maximum height of the world in blocks. */
export const WORLD_HEIGHT: number = 32;

/** The number of chunks to render in each direction from the player. */
export const RENDER_DISTANCE: number = 3;

// =============================================================================
// Block Types
// =============================================================================

/**
 * Enumeration of all block types in the game.
 * Values are numeric IDs for efficient storage and network transmission.
 */
export const enum BlockType {
  /** Dirt block - common underground block. */
  DIRT = 1,
  /** Grass block - surface block with grass on top. */
  GRASS = 2,
  /** Stone block - primary underground block. */
  STONE = 3,
  /** Wood block - from trees, used for crafting. */
  WOOD = 4,
  /** Leaves block - foliage from trees. */
  LEAVES = 5,
  /** Sand block - found near water and in deserts. */
  SAND = 6,
  /** Water block - liquid block. */
  WATER = 7,
}

// =============================================================================
// Physics Constants
// =============================================================================

/** Gravitational acceleration in blocks per second squared. */
export const GRAVITY: number = -30;

/** Player movement speed in blocks per second. */
export const PLAYER_SPEED: number = 5;

/** Initial upward velocity when the player jumps, in blocks per second. */
export const PLAYER_JUMP_FORCE: number = 8;

// =============================================================================
// Time Constants
// =============================================================================

/** Duration of a full day-night cycle in milliseconds (5 minutes). */
export const DAY_CYCLE_DURATION: number = 300000;
