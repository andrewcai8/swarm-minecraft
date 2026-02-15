/**
 * Block type registry for the Minecraft clone.
 * Defines all block types, their visual properties, and helper functions.
 */

/**
 * Enumeration of all block types in the game.
 */
export enum BlockType {
  Dirt = 'dirt',
  Grass = 'grass',
  Stone = 'stone',
  Wood = 'wood',
  Leaves = 'leaves',
  Sand = 'sand',
  Water = 'water',
}

/**
 * Configuration for a block type.
 * Defines the visual and physical properties of a block.
 */
export interface BlockConfig {
  /** The unique identifier for this block type */
  id: BlockType;
  /** Human-readable name for the block */
  name: string;
  /** Primary color for the block (hex format, e.g., #8B4513) */
  color: string;
  /** Optional top face color for blocks with different top/bottom (hex format) */
  topColor?: string;
  /** Whether the block is solid and can be collided with */
  solid: boolean;
  /** Whether the block is transparent (for rendering order) */
  transparent?: boolean;
}

/**
 * Registry of all block configurations.
 * Maps each BlockType to its corresponding BlockConfig.
 */
export const BLOCK_CONFIGS: Record<BlockType, BlockConfig> = {
  [BlockType.Dirt]: {
    id: BlockType.Dirt,
    name: 'Dirt',
    color: '#8B4513',
    solid: true,
  },
  [BlockType.Grass]: {
    id: BlockType.Grass,
    name: 'Grass',
    color: '#8B4513', // Side color (brown)
    topColor: '#228B22', // Top color (green)
    solid: true,
  },
  [BlockType.Stone]: {
    id: BlockType.Stone,
    name: 'Stone',
    color: '#808080',
    solid: true,
  },
  [BlockType.Wood]: {
    id: BlockType.Wood,
    name: 'Wood',
    color: '#8B4513',
    solid: true,
  },
  [BlockType.Leaves]: {
    id: BlockType.Leaves,
    name: 'Leaves',
    color: '#228B22',
    solid: true,
  },
  [BlockType.Sand]: {
    id: BlockType.Sand,
    name: 'Sand',
    color: '#F4D03F',
    solid: true,
  },
  [BlockType.Water]: {
    id: BlockType.Water,
    name: 'Water',
    color: '#3498DB',
    solid: false,
    transparent: true,
  },
};

/**
 * Gets the primary color for a block type.
 * @param type - The block type to get the color for
 * @returns The hex color string for the block
 */
export function getBlockColor(type: BlockType): string {
  const config = BLOCK_CONFIGS[type];
  if (!config) {
    throw new Error(`Unknown block type: ${type}`);
  }
  return config.color;
}

/**
 * Gets the top face color for a block type, if different from the primary color.
 * @param type - The block type to get the top color for
 * @returns The hex color string for the top face, or the primary color if no top color is defined
 */
export function getBlockTopColor(type: BlockType): string {
  const config = BLOCK_CONFIGS[type];
  if (!config) {
    throw new Error(`Unknown block type: ${type}`);
  }
  return config.topColor ?? config.color;
}

/**
 * Checks if a block type is solid (can be collided with).
 * @param type - The block type to check
 * @returns True if the block is solid, false otherwise
 */
export function isSolid(type: BlockType): boolean {
  const config = BLOCK_CONFIGS[type];
  if (!config) {
    throw new Error(`Unknown block type: ${type}`);
  }
  return config.solid;
}

/**
 * Checks if a block type is transparent (for rendering order).
 * @param type - The block type to check
 * @returns True if the block is transparent, false otherwise
 */
export function isTransparent(type: BlockType): boolean {
  const config = BLOCK_CONFIGS[type];
  if (!config) {
    throw new Error(`Unknown block type: ${type}`);
  }
  return config.transparent ?? false;
}
