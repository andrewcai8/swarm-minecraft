import { Canvas } from '@react-three/fiber';
import { Sky, Stats } from '@react-three/drei';
import { Physics } from '@react-three/cannon';

/**
 * Main application component.
 * Sets up the R3F Canvas, physics world, and scene.
 */
export function App(): JSX.Element {
  return (
    <>
      <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 20, 0] }}>
        <Sky sunPosition={[100, 200, 100]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[100, 200, 100]} intensity={0.8} />
        <Physics gravity={[0, -28, 0]}>
          {/* Player, Terrain, and Block components will be added here */}
        </Physics>
        <Stats />
      </Canvas>
    </>
  );
}
