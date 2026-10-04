"use client";

// One tiny external store per page: the configuration the visitor is editing,
// plus the few live controls the 3D cell listens to (view, speed, operator).
// React reads it through useSyncExternalStore; the WebGL engine subscribes
// directly and never re-renders React.

import { useSyncExternalStore } from "react";
import { DEFAULT_CONFIG, type Config, type ModelId } from "./plan";

export type View = "iso" | "top" | "op";
export type Zone = "out" | "slow" | "stop";

export type CellState = {
  config: Config;
  /** Model forced by the page (model pages, "bu model sizin için mi"). */
  lock: ModelId | null;
  view: View;
  speed: 1 | 4;
  paused: boolean;
  /** Operator marker on the floor (metres, world X/Z), null = not placed. */
  operator: { x: number; z: number } | null;
  /** Zone the operator stands in (set by whoever owns the geometry). */
  zone: Zone;
  /** Live counters published by the engine (or the static fallback). */
  live: { station: 0 | 1; placed: number; layer: number; waiting: number };
};

type Listener = () => void;

function createStore(initial: CellState) {
  let state = initial;
  const listeners = new Set<Listener>();
  return {
    get: () => state,
    set(patch: Partial<CellState> | ((s: CellState) => Partial<CellState>)) {
      const p = typeof patch === "function" ? patch(state) : patch;
      state = { ...state, ...p };
      listeners.forEach((l) => l());
    },
    setConfig(patch: Partial<Config>) {
      state = { ...state, config: { ...state.config, ...patch } };
      listeners.forEach((l) => l());
    },
    subscribe(l: Listener) {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
  };
}

export const cell = createStore({
  config: { ...DEFAULT_CONFIG, kind: "torba", u: 600, g: 400, y: 120, kg: 25, rate: 5, shifts: 3, maxH: 1300 },
  lock: null,
  view: "iso",
  speed: 1,
  paused: false,
  operator: null,
  zone: "out",
  live: { station: 0, placed: 0, layer: 0, waiting: 0 },
});

export type CellStore = typeof cell;

export function useCell<T>(select: (s: CellState) => T): T {
  return useSyncExternalStore(
    cell.subscribe,
    () => select(cell.get()),
    () => select(cell.get()),
  );
}
