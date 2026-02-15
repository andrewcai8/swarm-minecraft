import { useInventoryStore, BLOCK_COLORS } from '../hooks/useStore.js';

/** CSS styles for HUD elements. */
const styles = {
  /** Container for all HUD elements. */
  hudContainer: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
    zIndex: 1000,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    padding: '20px 0',
  },
  /** Crosshair in the center of the screen. */
  crosshair: {
    position: 'fixed' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '20px',
    height: '20px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  /** Horizontal line of the crosshair. */
  crosshairHorizontal: {
    position: 'absolute' as const,
    width: '20px',
    height: '2px',
    backgroundColor: 'white',
  },
  /** Vertical line of the crosshair. */
  crosshairVertical: {
    position: 'absolute' as const,
    width: '2px',
    height: '20px',
    backgroundColor: 'white',
  },
  /** Container for the hotbar. */
  hotbarContainer: {
    display: 'flex' as const,
    gap: '4px',
    padding: '4px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '4px',
  },
  /** Individual hotbar slot. */
  hotbarSlot: {
    width: '50px',
    height: '50px',
    backgroundColor: 'rgba(139, 139, 139, 0.6)',
    border: '2px solid #555',
    borderRadius: '4px',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    position: 'relative' as const,
  },
  /** Selected hotbar slot highlight. */
  hotbarSlotSelected: {
    border: '3px solid white',
  },
  /** Block color preview square. */
  blockColor: {
    width: '32px',
    height: '32px',
    borderRadius: '2px',
  },
  /** Empty slot indicator. */
  emptySlot: {
    width: '32px',
    height: '32px',
    borderRadius: '2px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  /** Block count display. */
  blockCount: {
    position: 'absolute' as const,
    bottom: '2px',
    right: '4px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.8)',
  },
  /** Slot number indicator (1-9). */
  slotNumber: {
    position: 'absolute' as const,
    top: '2px',
    left: '4px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '10px',
  },
};

/**
 * Heads-up display overlay component.
 * Renders a crosshair in the center and a hotbar at the bottom.
 * This component renders outside the Canvas as a DOM sibling.
 * Uses CSS fixed positioning with z-index above the canvas.
 */
export function HUD(): JSX.Element {
  const slots = useInventoryStore((state) => state.slots);
  const selectedSlot = useInventoryStore((state) => state.selectedSlot);

  return (
    <div style={styles.hudContainer}>
      {/* Crosshair */}
      <div style={styles.crosshair}>
        <div style={styles.crosshairHorizontal} />
        <div style={styles.crosshairVertical} />
      </div>

      {/* Hotbar at bottom center */}
      <div style={styles.hotbarContainer}>
        {slots.map((slot, index) => {
          const isSelected = index === selectedSlot;
          const blockColor = slot.blockType ? BLOCK_COLORS[slot.blockType] : null;

          return (
            <div
              key={index}
              style={{
                ...styles.hotbarSlot,
                ...(isSelected ? styles.hotbarSlotSelected : {}),
              }}
            >
              {/* Slot number (1-9) */}
              <span style={styles.slotNumber}>{index + 1}</span>

              {/* Block color or empty indicator */}
              {slot.blockType && blockColor ? (
                <div
                  style={{
                    ...styles.blockColor,
                    backgroundColor: blockColor,
                  }}
                />
              ) : (
                <div style={styles.emptySlot} />
              )}

              {/* Block count */}
              {slot.count > 0 && (
                <span style={styles.blockCount}>{slot.count}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
