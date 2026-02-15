import { create } from 'zustand';

/**
 * Supported block types in the game.
 */
export type BlockType = 'DIRT' | 'STONE' | 'GRASS' | 'WOOD' | 'LEAVES' | 'SAND' | 'WATER' | 'COBBLESTONE';

/**
 * Represents a single slot in the inventory.
 * An empty slot has blockType set to null and count set to 0.
 */
export interface InventorySlot {
  /** The type of block in this slot, or null if empty */
  blockType: BlockType | null;
  /** The number of blocks in this slot */
  count: number;
}

/** Total number of inventory slots */
const INVENTORY_SIZE = 9;

/** Maximum stack size for any block type */
const MAX_STACK_SIZE = 64;

/**
 * Creates an empty inventory slot.
 * @returns An empty InventorySlot with blockType null and count 0
 */
function createEmptySlot(): InventorySlot {
  return { blockType: null, count: 0 };
}

/**
 * Creates an inventory slot with a specific block type and count.
 * @param blockType - The type of block
 * @param count - The number of blocks
 * @returns An InventorySlot with the specified values
 */
function createSlot(blockType: BlockType, count: number): InventorySlot {
  return { blockType, count };
}

/**
 * State and actions for the player inventory.
 */
export interface InventoryState {
  /** Array of 9 inventory slots */
  slots: InventorySlot[];
  /** Currently selected hotbar slot index (0-8) */
  selectedSlot: number;
  /** The hotbar (first 9 slots, same as slots for this implementation) */
  hotbar: InventorySlot[];
  /**
   * Selects a hotbar slot by index.
   * Clamps the index to the valid range (0-8).
   * @param index - The slot index to select
   */
  selectSlot: (index: number) => void;
  /**
   * Adds a block of the specified type to the inventory.
   * First tries to stack with existing slots of the same type,
   * then falls back to the first empty slot.
   * @param type - The block type to add
   * @returns true if the block was added, false if inventory is full
   */
  addBlock: (type: BlockType) => boolean;
  /**
   * Removes a block of the specified type from the inventory.
   * Decrements the count in the first slot containing that block type.
   * Removes the item from the slot when count reaches 0.
   * @param type - The block type to remove
   * @returns true if a block was removed, false if none of that type exist
   */
  removeBlock: (type: BlockType) => boolean;
}

/**
 * Initial inventory state with starting blocks.
 * Slot 0: 64 DIRT
 * Slot 1: 32 STONE
 * Slots 2-8: Empty
 */
function getInitialSlots(): InventorySlot[] {
  return [
    createSlot('DIRT', 64),
    createSlot('STONE', 32),
    createEmptySlot(),
    createEmptySlot(),
    createEmptySlot(),
    createEmptySlot(),
    createEmptySlot(),
    createEmptySlot(),
    createEmptySlot(),
  ];
}

/**
 * Zustand store for managing player inventory state.
 */
export const useInventoryStore = create<InventoryState>((set, get) => ({
  slots: getInitialSlots(),
  selectedSlot: 0,
  hotbar: getInitialSlots(),

  selectSlot: (index: number) => {
    const clampedIndex = Math.max(0, Math.min(INVENTORY_SIZE - 1, index));
    set({ selectedSlot: clampedIndex });
  },

  addBlock: (type: BlockType) => {
    const { slots } = get();
    const newSlots = [...slots];

    // First, try to find an existing slot with the same block type that isn't full
    const existingSlotIndex = newSlots.findIndex(
      (slot) => slot.blockType === type && slot.count < MAX_STACK_SIZE
    );

    if (existingSlotIndex !== -1) {
      // Add to existing stack
      const existingSlot = newSlots[existingSlotIndex];
      if (existingSlot) {
        newSlots[existingSlotIndex] = {
          blockType: existingSlot.blockType,
          count: existingSlot.count + 1,
        };
        set({ slots: newSlots, hotbar: newSlots });
      }
      return true;
    }

    // No existing stack found, find first empty slot
    const emptySlotIndex = newSlots.findIndex(
      (slot) => slot.blockType === null
    );

    if (emptySlotIndex !== -1) {
      // Add to empty slot
      newSlots[emptySlotIndex] = createSlot(type, 1);
      set({ slots: newSlots, hotbar: newSlots });
      return true;
    }

    // Inventory is full
    return false;
  },

  removeBlock: (type: BlockType) => {
    const { slots } = get();
    const slotIndex = slots.findIndex((slot) => slot.blockType === type);

    if (slotIndex === -1) {
      // No blocks of this type in inventory
      return false;
    }

    const newSlots = [...slots];
    const currentSlot = newSlots[slotIndex];
    
    if (!currentSlot) {
      return false;
    }

    const currentCount = currentSlot.count;

    if (currentCount <= 1) {
      // Remove the item entirely
      newSlots[slotIndex] = createEmptySlot();
    } else {
      // Decrement the count
      newSlots[slotIndex] = {
        blockType: currentSlot.blockType,
        count: currentCount - 1,
      };
    }

    set({ slots: newSlots, hotbar: newSlots });
    return true;
  },
}));
