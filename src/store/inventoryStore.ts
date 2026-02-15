import { create } from 'zustand';

/**
 * Represents a slot in the player's inventory.
 */
export interface InventorySlot {
  /** The block type identifier. */
  type: string;
  /** Number of items in this slot. */
  count: number;
}

/**
 * Available block types in the game.
 */
export const BLOCK_TYPES = {
  GRASS: 'grass',
  DIRT: 'dirt',
  STONE: 'stone',
  WOOD: 'wood',
  LEAVES: 'leaves',
  SAND: 'sand',
  WATER: 'water',
  COBBLESTONE: 'cobblestone',
  PLANKS: 'planks',
} as const;

/**
 * Inventory state.
 */
export interface InventoryState {
  /** Array of inventory slots. Index 0-8 are hotbar slots. */
  slots: InventorySlot[];
  /** Currently selected hotbar slot (0-8). */
  selectedSlot: number;
  /** Whether the inventory screen is open. */
  isOpen: boolean;
}

/**
 * Actions for modifying inventory state.
 */
export interface InventoryActions {
  /** Add items to the inventory. Returns true if successful. */
  addItem: (type: string, count: number) => boolean;
  /** Remove items from a specific slot. Returns the removed count. */
  removeItem: (slotIndex: number, count: number) => number;
  /** Set the selected hotbar slot. */
  setSelectedSlot: (slot: number) => void;
  /** Get the currently selected item. */
  getSelectedItem: () => InventorySlot | undefined;
  /** Toggle the inventory screen open/closed. */
  toggleInventory: () => void;
  /** Set inventory open state. */
  setInventoryOpen: (open: boolean) => void;
  /** Clear all inventory slots. */
  clearInventory: () => void;
}

/**
 * Complete inventory store type combining state and actions.
 */
export type InventoryStore = InventoryState & InventoryActions;

/** Maximum stack size for inventory items. */
const MAX_STACK_SIZE = 64;

/** Total number of inventory slots (hotbar + inventory). */
const TOTAL_SLOTS = 36;

/** Initial hotbar items for a new player. */
const INITIAL_HOTBAR: InventorySlot[] = [
  { type: BLOCK_TYPES.GRASS, count: 64 },
  { type: BLOCK_TYPES.DIRT, count: 64 },
  { type: BLOCK_TYPES.STONE, count: 64 },
  { type: BLOCK_TYPES.WOOD, count: 64 },
  { type: BLOCK_TYPES.PLANKS, count: 64 },
  { type: BLOCK_TYPES.COBBLESTONE, count: 64 },
  { type: BLOCK_TYPES.SAND, count: 64 },
  { type: BLOCK_TYPES.LEAVES, count: 32 },
  { type: BLOCK_TYPES.WATER, count: 16 },
];

/**
 * Creates an empty inventory slots array.
 * @returns Array of empty inventory slots
 */
function createEmptySlots(): InventorySlot[] {
  const slots: InventorySlot[] = [];
  for (let i = 0; i < TOTAL_SLOTS; i++) {
    const initialItem = INITIAL_HOTBAR[i];
    if (initialItem !== undefined) {
      slots.push({ type: initialItem.type, count: initialItem.count });
    } else {
      slots.push({ type: '', count: 0 });
    }
  }
  return slots;
}

/**
 * Zustand store for player inventory state.
 * Manages inventory slots, selected item, and inventory UI state.
 */
export const useInventoryStore = create<InventoryStore>((set, get) => ({
  slots: createEmptySlots(),
  selectedSlot: 0,
  isOpen: false,

  addItem: (type: string, count: number): boolean => {
    const state = get();
    let remaining = count;

    // First, try to stack with existing slots of the same type
    const newSlots = [...state.slots];
    for (let i = 0; i < newSlots.length && remaining > 0; i++) {
      const slot = newSlots[i];
      if (slot !== undefined && slot.type === type && slot.count < MAX_STACK_SIZE) {
        const canAdd = Math.min(remaining, MAX_STACK_SIZE - slot.count);
        newSlots[i] = { type: slot.type, count: slot.count + canAdd };
        remaining -= canAdd;
      }
    }

    // Then, try to find empty slots
    for (let i = 0; i < newSlots.length && remaining > 0; i++) {
      const slot = newSlots[i];
      if (slot !== undefined && slot.count === 0) {
        const canAdd = Math.min(remaining, MAX_STACK_SIZE);
        newSlots[i] = { type, count: canAdd };
        remaining -= canAdd;
      }
    }

    if (remaining < count) {
      set({ slots: newSlots });
      return true;
    }
    return false;
  },

  removeItem: (slotIndex: number, count: number): number => {
    const state = get();
    if (slotIndex < 0 || slotIndex >= state.slots.length) {
      return 0;
    }

    const slot = state.slots[slotIndex];
    if (slot === undefined || slot.count === 0) {
      return 0;
    }

    const removedCount = Math.min(count, slot.count);
    const newSlots = [...state.slots];
    newSlots[slotIndex] = {
      type: slot.count - removedCount > 0 ? slot.type : '',
      count: slot.count - removedCount,
    };
    set({ slots: newSlots });
    return removedCount;
  },

  setSelectedSlot: (slot: number) => {
    if (slot >= 0 && slot < 9) {
      set({ selectedSlot: slot });
    }
  },

  getSelectedItem: (): InventorySlot | undefined => {
    const state = get();
    const slot = state.slots[state.selectedSlot];
    if (slot === undefined || slot.count === 0) {
      return undefined;
    }
    return slot;
  },

  toggleInventory: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  setInventoryOpen: (open: boolean) => {
    set({ isOpen: open });
  },

  clearInventory: () => {
    const emptySlots: InventorySlot[] = [];
    for (let i = 0; i < TOTAL_SLOTS; i++) {
      emptySlots.push({ type: '', count: 0 });
    }
    set({
      slots: emptySlots,
      selectedSlot: 0,
    });
  },
}));
