import type { Ref } from 'react';
import { useBox, type Triplet } from '@react-three/cannon';
import type { Mesh } from 'three';
import { getBlockColor, type BlockType } from '../utils/blocks.js';

/**
 * Props for the Cube component.
 */
export interface CubeProps {
  /** The world position of the block as [x, y, z] coordinates */
  position: Triplet;
  /** The type of block to render, determines the color */
  blockType: BlockType;
}

/**
 * Renders an individual block in the world with physics collision.
 * Uses a static physics body for placed blocks that don't move.
 * The block is rendered as a 1x1x1 cube with color based on block type.
 *
 * @param props - The component props
 * @param props.position - The world position as [x, y, z] coordinates
 * @param props.blockType - The type of block to render
 * @returns A React Three Fiber mesh component with physics
 */
export function Cube({ position, blockType }: CubeProps): JSX.Element {
  const [ref] = useBox<Mesh>(() => ({
    type: 'Static',
    position: position,
    args: [0.5, 0.5, 0.5],
  }));

  const color = getBlockColor(blockType);

  return (
    <mesh ref={ref as Ref<Mesh>} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
