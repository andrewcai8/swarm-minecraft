import { createNoise2D } from 'simplex-noise';
import type { NoiseFunction2D } from 'simplex-noise';

/**
 * A terrain noise function that produces height values for terrain generation.
 * Takes x and z world coordinates and returns a normalized noise value in [0, 1].
 */
export type TerrainNoiseFunction = (x: number, z: number) => number;

/**
 * Creates a deterministic terrain noise function from a seed value.
 * The same seed will always produce the same noise values for identical coordinates.
 *
 * @param seed - The seed value for the noise generator
 * @returns A function that takes (x, z) coordinates and returns noise values in [0, 1]
 *
 * @example
 * const noise = createTerrainNoise(12345);
 * const value = noise(10, 20); // Returns a value between 0 and 1
 */
export function createTerrainNoise(seed: number): TerrainNoiseFunction {
  // Create a seeded random function for deterministic noise generation
  // Use a copy of the seed to avoid mutating the original
  let state = seed;
  const random = (): number => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const noise2D: NoiseFunction2D = createNoise2D(random);

  // Noise function returns [-1, 1], normalize to [0, 1]
  return (x: number, z: number): number => {
    const value = noise2D(x, z);
    return (value + 1) / 2;
  };
}

/**
 * Octave configuration for multi-octave noise generation.
 * Each octave adds detail at progressively smaller scales.
 */
interface OctaveConfig {
  /** The amplitude multiplier for this octave */
  amplitude: number;
  /** The frequency multiplier for this octave */
  frequency: number;
}

/** Default octave configuration for natural terrain generation */
const DEFAULT_OCTAVES: OctaveConfig[] = [
  { amplitude: 1, frequency: 0.01 },
  { amplitude: 0.5, frequency: 0.02 },
  { amplitude: 0.25, frequency: 0.04 },
];

/**
 * Calculates terrain height at the given world coordinates using multi-octave noise.
 * Combines multiple noise frequencies to create natural-looking terrain with
 * both large-scale features and fine detail.
 *
 * @param noise - The terrain noise function created by createTerrainNoise
 * @param x - The x coordinate in world space
 * @param z - The z coordinate in world space
 * @param maxHeight - The maximum height of the terrain
 * @returns The terrain height at the given coordinates, in range [0, maxHeight]
 *
 * @example
 * const noise = createTerrainNoise(12345);
 * const height = getTerrainHeight(noise, 100, 200, 64); // Returns height 0-64
 */
export function getTerrainHeight(
  noise: TerrainNoiseFunction,
  x: number,
  z: number,
  maxHeight: number
): number {
  let totalAmplitude = 0;
  let noiseSum = 0;

  for (const octave of DEFAULT_OCTAVES) {
    const scaledX = x * octave.frequency;
    const scaledZ = z * octave.frequency;
    noiseSum += noise(scaledX, scaledZ) * octave.amplitude;
    totalAmplitude += octave.amplitude;
  }

  // Normalize by total amplitude to keep result in [0, 1]
  const normalizedHeight = noiseSum / totalAmplitude;

  // Scale to desired height range [0, maxHeight]
  return normalizedHeight * maxHeight;
}
