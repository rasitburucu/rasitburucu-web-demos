"use client";

// Small shared state for the Damar pages: the sample box (kept in this
// browser's localStorage, never sent anywhere), the last estimate from the
// home page (for the phone bar and the quote form) and a toast line.
import { useSyncExternalStore } from "react";
import { isFinish, isStoneId, type Finish, type StoneId, type Thickness } from "@/content/damar/stones";
import type { Payload } from "./calc";

export type SampleSize = "10" | "30";
export type SampleItem = {
  key: string;
  stone: StoneId;
  /** first slab of the pair, or null for "any slab of this block" */
  pair: number | null;
  finish: Finish;
  size: SampleSize;
};

export type Quote = {
  stone: StoneId;
  pair: number;
  m2: number;
  t: Thickness;
  finish: Finish;
  limit: Payload;
};

export type Toast = { id: number; text: string; link?: boolean } | null;

export const BOX_MAX = 8;
const BOX_KEY = "damar-sample-box-v1";
const QUOTE_KEY = "damar-quote-v1";

type State = { box: SampleItem[]; quote: Quote | null; toast: Toast; ready: boolean };
let state: State = { box: [], quote: null, toast: null, ready: false };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const set = (patch: Partial<State>) => {
  state = { ...state, ...patch };
  emit();
};

function read<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode or storage off: the box lives for this visit only */
  }
}

const validItem = (x: unknown): x is SampleItem => {
  const i = x as SampleItem;
  return !!i && isStoneId(i.stone) && isFinish(i.finish) && (i.size === "10" || i.size === "30") && (i.pair === null || Number.isInteger(i.pair));
};

function hydrate() {
  if (state.ready || typeof window === "undefined") return;
  const box = (read<unknown[]>(BOX_KEY) ?? []).filter(validItem).slice(0, BOX_MAX);
  const q = read<Quote>(QUOTE_KEY);
  const quote = q && isStoneId(q.stone) && isFinish(q.finish) ? q : null;
  state = { ...state, box, quote, ready: true };
}

function subscribe(l: () => void) {
  hydrate();
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === BOX_KEY || e.key === QUOTE_KEY) {
      state = { ...state, ready: false };
      hydrate();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  // first paint on the client: storage was read inside subscribe
  queueMicrotask(emit);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

const SERVER: State = { box: [], quote: null, toast: null, ready: false };
export function useDamar<T>(pick: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => pick(state),
    () => pick(SERVER),
  );
}

const itemKey = (stone: StoneId, pair: number | null) => `${stone}:${pair ?? "any"}`;

/** Adds a piece; returns what happened (and the new count) for the toast. */
export function addSample(stone: StoneId, pair: number | null, finish: Finish): { result: "added" | "already" | "full"; count: number } {
  hydrate();
  const key = itemKey(stone, pair);
  if (state.box.some((i) => i.key === key)) return { result: "already", count: state.box.length };
  if (state.box.length >= BOX_MAX) return { result: "full", count: state.box.length };
  const box = [...state.box, { key, stone, pair, finish, size: "10" as SampleSize }];
  write(BOX_KEY, box);
  set({ box });
  return { result: "added", count: box.length };
}

export function updateSample(key: string, patch: Partial<Pick<SampleItem, "finish" | "size">>) {
  const box = state.box.map((i) => (i.key === key ? { ...i, ...patch } : i));
  write(BOX_KEY, box);
  set({ box });
}

export function removeSample(key: string) {
  const box = state.box.filter((i) => i.key !== key);
  write(BOX_KEY, box);
  set({ box });
}

export function saveQuote(q: Quote) {
  write(QUOTE_KEY, q);
  state = { ...state, quote: q };
  emit();
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;
export function showToast(text: string, link = false) {
  clearTimeout(toastTimer);
  set({ toast: { id: Date.now(), text, link } });
  toastTimer = setTimeout(() => set({ toast: null }), 4200);
}
export function hideToast() {
  clearTimeout(toastTimer);
  set({ toast: null });
}
