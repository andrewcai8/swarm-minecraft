import { create } from 'zustand';

/** A single inventory slot containing a block type and count. */
export interface InventorySlot {
  /** Block type identifier (e.g., 'dirt', 'stone', 'grass'). */
  blockType: string | null;
  /** Number of blocks of this type in the slot. */
  count: number;
}

/** Inventory store state. */
interface InventoryState {
  /** Array of 9 inventory slots. */
  slots: InventorySlot[];
  /** Currently selected slot index (0-8). */
  selectedSlot: number;
  /** Select a slot by index. */
  selectSlot: (index: number) => void;
  /** Add blocks to a slot. */
  addToSlot: (index: number, blockType: string, count: number) => void;
  /** Remove one block from a slot. */
  removeFromSlot: (index: number) => void;
}

/** Default block types for initial inventory. */
const DEFAULT_INVENTORY: InventorySlot[] = [
  { blockType: 'grass', count: 64 },
  { blockType: 'dirt', count: 64 },
  { blockType: 'stone', count: 64 },
  { blockType: 'wood', count: 64 },
  { blockType: 'leaves', count: 64 },
  { blockType: 'sand', count: 64 },
  { blockType: 'water', count: 64 },
  { blockType: 'cobblestone', count: 64 },
  { blockType: 'planks', count: 64 },
];

/** Block color mappings for display in the HUD. */
export const BLOCK_COLORS: Record<string, string> = {
  grass: '#4a7c23',
  dirt: '#8b5a2b',
  stone: '#808080',
  wood: '#8b4513',
  leaves: '#228b22',
  sand: '#f4d03f',
  water: '#1e90ff',
  cobblestone: '#696969',
  planks: '#deb887',
};

/**
 * Zustand store for inventory management.
 * Handles 9 hotbar slots with block types and counts.
 */
export const useInventoryStore = create<InventoryState>((set) => ({
  slots: DEFAULT_INVENTORY,
  selectedSlot: 0,
  selectSlot: (index: number) => {
    if (index >= 0 && index < 9) {
      set({ selectedSlot: index });
    }
  },
  addToSlot: (index: number, blockType: string, count: number) => {
    set((state) => {
      if (index < 0 || index >= state.slots.length) return state;
      const newSlots = [...state.slots];
      const slot = newSlots[index];
      if (slot && (slot.blockType === blockType || slot.blockType === null)) {
        newSlots[index] = {
          blockType,
          count: slot.blockType === null ? count : slot.count + count,
        };
      }
      return { slots: newSlots };
    });
  },
  removeFromSlot: (index: number) => {
    set((state) => {
      if (index < 0 || index >= state.slots.length) return state;
      const newSlots = [...state.slots];
      const slot = newSlots[index];
      if (slot && slot.count > 0) {
        const newCount = slot.count - 1;
        newSlots[index] = {
          blockType: newCount === 0 ? null : slot.blockType,
          count: newCount,
        };
      }
      return { slots: newSlots };
    });
  },
}));
