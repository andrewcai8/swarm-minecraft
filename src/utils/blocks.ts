/**
 * Block types available in the game.
 * Each block type has an associated color for rendering.
 */
export type BlockType =
  | 'grass'
  | 'dirt'
  | 'stone'
  | 'wood'
  | 'leaves'
  | 'sand'
  | 'water'
  | 'cobblestone'
  | 'planks';

/**
 * Mapping of block types to their render colors.
 * Colors are in hex format compatible with Three.js.
 */
const BLOCK_COLORS: Record<BlockType, string> = {
  grass: '#4a7c23',
  dirt: '#8b5a2b',
  stone: '#808080',
  wood: '#6b4423',
  leaves: '#2d5a1d',
  sand: '#c2b280',
  water: '#3366cc',
  cobblestone: '#6e6e6e',
  planks: '#b8860b',
};

/**
 * Gets the color associated with a block type.
 *
 * @param blockType - The type of block to get the color for
 * @returns The hex color string for the block type
 */
export function getBlockColor(blockType: BlockType): string {
  return BLOCK_COLORS[blockType];
}
