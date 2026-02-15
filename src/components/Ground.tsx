import { useRef } from 'react';
import { usePlane } from '@react-three/cannon';
import type { Mesh } from 'three';

/**
 * A physics-enabled ground plane component.
 * Renders a horizontal green plane at y=0 with static physics collision.
 * This is a temporary visual ground until terrain is implemented.
 */
export function Ground(): JSX.Element {
  const meshRef = useRef<Mesh>(null);

  usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    type: 'Static',
    friction: 1,
  }), meshRef);

  return (
    <mesh ref={meshRef} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#3d8c40" />
    </mesh>
  );
}
