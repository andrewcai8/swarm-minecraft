/**
 * Sky component with animated day/night cycle.
 * @module components/Sky
 */

import { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky as DreiSky } from '@react-three/drei';

/** Duration of a full day/night cycle in milliseconds (5 minutes) */
const DAY_CYCLE_DURATION = 5 * 60 * 1000;

/** Orbital radius for the sun's circular path */
const SUN_ORBIT_RADIUS = 100;

/** Z-axis position for the sun (depth into scene) */
const SUN_Z_POSITION = 100;

/**
 * Custom hook that calculates sun position for day/night cycle.
 *
 * The sun moves in a circular path over DAY_CYCLE_DURATION (5 minutes).
 * When sun Y position is positive, the sky is blue (day).
 * When sun Y position is negative, the sky darkens (night).
 *
 * @returns Current sun position as [x, y, z] tuple
 */
export function useDayNight(): [number, number, number] {
  const [sunPosition, setSunPosition] = useState<[number, number, number]>([
    SUN_ORBIT_RADIUS,
    0,
    SUN_Z_POSITION,
  ]);

  useFrame(({ clock }) => {
    // Convert elapsed seconds to milliseconds and wrap to cycle duration
    const elapsedMs = (clock.getElapsedTime() * 1000) % DAY_CYCLE_DURATION;

    // Calculate progress through the cycle (0 to 1)
    const progress = elapsedMs / DAY_CYCLE_DURATION;

    // Convert progress to angle (0 to 2π)
    const angle = progress * Math.PI * 2;

    // Calculate sun position in circular orbit
    // Y position determines day (positive) vs night (negative)
    const x = SUN_ORBIT_RADIUS * Math.cos(angle);
    const y = SUN_ORBIT_RADIUS * Math.sin(angle);

    setSunPosition([x, y, SUN_Z_POSITION]);
  });

  return sunPosition;
}

/**
 * Sky component with animated day/night cycle.
 *
 * Renders Drei's Sky component with a sun that moves in a circular orbit
 * over a 5-minute cycle. The sky transitions from blue during the day
 * (sun above horizon) to dark at night (sun below horizon).
 *
 * @example
 * // Add to your R3F scene:
 * <DayNightSky />
 */
export function DayNightSky(): JSX.Element {
  const sunPosition = useDayNight();

  return <DreiSky sunPosition={sunPosition} />;
}
