/**
 * Central re-export point for all Zustand stores.
 * Provides a single import location for store hooks and their types.
 *
 * @example
 * ```typescript
 * import { useGameStore, useInventoryStore, GameStore, InventoryStore } from '@/hooks/useStore';
 *
 * const blocks = useGameStore((state) => state.blocks);
 * const selectedSlot = useInventoryStore((state) => state.selectedSlot);
 * ```
 */

export { useGameStore, type GameStore, type GameState, type GameActions, type Block, type BlockPosition } from '../store/gameStore';

export {
  useInventoryStore,
  type InventoryStore,
  type InventoryState,
  type InventoryActions,
  type InventorySlot,
  BLOCK_TYPES,
} from '../store/inventoryStore';
