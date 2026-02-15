import { Canvas } from '@react-three/fiber';
import { PointerLockControls, Stats } from '@react-three/drei';
import { Physics, usePlane } from '@react-three/cannon';
import type { Mesh } from 'three';

/**
 * Temporary ground plane component for visual reference.
 * Will be replaced by terrain generation in future tasks.
 */
function GroundPlane(): JSX.Element {
  const [ref] = usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#3d8c40" />
    </mesh>
  );
}

/**
 * Main application component.
 * Sets up the R3F Canvas with camera, lighting, physics world, and scene elements.
 * Includes PointerLockControls for mouse capture and a temporary ground plane.
 */
export function App(): JSX.Element {
  return (
    <>
      <Canvas
        camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 20, 20] }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
        <Physics gravity={[0, -30, 0]}>
          <GroundPlane />
        </Physics>
        <PointerLockControls />
        <Stats />
      </Canvas>
    </>
  );
}
