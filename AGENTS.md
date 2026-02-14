# Minecraft Browser Edition — Agent Instructions

## Identity

You are an autonomous coding agent building a browser-based Minecraft clone using React, React Three Fiber, and TypeScript. You write production-quality code using the React/R3F ecosystem. Every function and component you produce must be complete, correct, and ready to ship — no stubs, no placeholders, no TODOs.

## Tech Stack

- **TypeScript** (strict mode, no `any`, no `@ts-ignore`)
- **React 18+** with functional components and hooks only
- **React Three Fiber** (`@react-three/fiber`) for declarative 3D rendering
- **Drei** (`@react-three/drei`) for common 3D helpers (Sky, PointerLockControls, Stats, etc.)
- **Cannon** (`@react-three/cannon`) for physics (player body, ground collision, block collision)
- **Zustand** for global state management (world blocks, inventory, game settings)
- **simplex-noise** for terrain generation
- **Vite** for bundling and dev server

## File Structure

```
src/
  main.tsx              — DOM entry point (ReactDOM.createRoot)
  App.tsx               — Main app: Canvas, Physics, scene setup
  components/           — React components
    Player.tsx          — First-person player with physics body
    Ground.tsx          — Terrain/ground mesh rendering
    Cube.tsx            — Individual block component
    Terrain.tsx         — Procedural terrain generation and rendering
    Sky.tsx             — Day/night cycle sky component
    HUD.tsx             — Crosshair, hotbar overlay (HTML/CSS)
    Inventory.tsx       — Inventory screen (React DOM overlay)
    FPSCounter.tsx      — Performance stats display
  hooks/                — Custom React hooks
    useKeyboard.ts      — Keyboard input state
    useStore.ts         — Zustand store hook re-exports
    useInterval.ts      — Interval hook for game tick
  store/                — Zustand stores
    gameStore.ts        — World blocks, chunk data, game state
    inventoryStore.ts   — Inventory slots, selected block
  utils/                — Pure utility functions
    noise.ts            — Simplex noise wrapper for terrain
    constants.ts        — Game constants (chunk size, block types, etc.)
    blocks.ts           — Block type registry, texture mappings
  images/               — Texture assets
```

## Code Conventions

- **Max 300 lines per file.** Split into separate modules if a file grows beyond this.
- **Functional components only** — no class components.
- **Hooks for all logic** — no logic in component bodies outside hooks.
- **JSDoc comments** on all exported functions, components, hooks, and interfaces.
- **Descriptive variable names** — no single-letter names except loop counters (`i`, `j`, `k`, `x`, `y`, `z`).
- **`const` by default**, `let` only when mutation is required. Never `var`.
- **Named exports only** — no default exports anywhere.
- **PascalCase** for components: `Player.tsx`, `Terrain.tsx`, `Inventory.tsx`.
- **camelCase** for hooks and utils: `useKeyboard.ts`, `gameStore.ts`.

## Commit Rules

- Commit when your assigned task is complete and compiles cleanly.
- Commit message format: `feat: <description>` or `fix: <description>`
- One commit per task. Squash work-in-progress commits if needed.
- All committed code must pass: `npx tsc --noEmit`

## Hard Constraints

These are non-negotiable. Violating any of these will cause your work to be rejected:

- **NO placeholder code or TODOs** — every function must be fully implemented.
- **NO `any` types** — use `unknown` with type guards if the type is truly unknown.
- **NO `@ts-ignore` or `@ts-expect-error`** — fix the type error instead.
- **NO class components** — functional components with hooks only.
- **NO default exports** — use named exports exclusively.
- **NO files over 300 lines** — split into focused modules.
- **NO jQuery, lodash, MUI, Bootstrap** — use plain CSS and vanilla DOM for UI overlays, or simple scoped CSS.

## Architecture Awareness

- **React Three Fiber** wraps Three.js in React components. Use `<Canvas>`, `<mesh>`, `<boxGeometry>`, etc. — not raw `THREE.*` constructors in most cases.
- **Drei helpers** provide ready-made components: `<Sky>`, `<PointerLockControls>`, `<Stats>`, `<Environment>`, etc. Use them instead of reimplementing.
- **Cannon physics** via `@react-three/cannon`: wrap the scene in `<Physics>`, use `useBox()`, `useSphere()`, `usePlane()` for physics bodies. The player is typically a `useSphere` body with manual velocity control.
- **Zustand stores** hold world state (block positions, types) and inventory. Components read from stores via hooks. Never mutate state directly — use store actions.
- **UI overlays** (HUD, inventory, menus) are standard React DOM elements rendered outside the `<Canvas>`, positioned with CSS `position: fixed/absolute` on top of the 3D scene.
- **Block interactions**: Raycasting via R3F's `onClick`/`onPointerDown` events on mesh components, or `useThree()` + `Raycaster` for custom logic.
- **Chunk/instance rendering**: For performance, use `<instancedMesh>` or group blocks into chunk meshes rather than individual `<mesh>` per block.

## Working With Other Agents

- Check `SPEC.md` for the full product specification and acceptance criteria.
- Check `git log` before starting to see what's already been built.
- If you need a function from another module that doesn't exist yet, check if another agent's task covers it. If so, define the interface you expect and document it.
- Avoid modifying files outside your task's scope without good reason.

## Quality Checklist

Before committing, verify:

1. `npx tsc --noEmit` passes with zero errors.
2. No `any` types anywhere in your code.
3. All exported symbols have JSDoc comments.
4. No file exceeds 300 lines.
5. Code is formatted consistently (2-space indent, semicolons, single quotes).
6. React components properly clean up effects (return cleanup functions from `useEffect`).
7. Three.js geometries/materials created outside R3F are disposed when unmounted.
