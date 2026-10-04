// Tiny mutable store shared by the DOM director and the WebGL scene.
// Continuous values (scroll, hour, pointer) are read every frame and never go
// through React state; discrete ones (hover, selection, tier) notify listeners.

export type Tier = "high" | "mid" | "low";

type Events = "hover" | "selected" | "dial" | "ready" | "load" | "tone" | "frame" | "post" | "focus" | "panel";

export const store = {
  /** Chapter index and local progress 0..1 (from scroll). */
  chapter: 0,
  t: 0,
  /** Hour from scroll, and the effective hour (dial override applied). */
  scrollHour: 5.683,
  hour: 5.683,
  /** 0 = clay maquette, 1 = real materials. */
  reveal: 0,
  /** Pointer in -1..1, y up. */
  px: 0,
  py: 0,
  hover: -1,
  selected: 6,
  /**
   * House the camera comes close to while the dial is on screen (-1: the whole
   * slope). Set by picking a house there (stone, scene, keyboard) or by "Bu evi
   * gör" in the registry; cleared by "Yakın planı kapat" or Escape.
   */
  focus: -1,
  /** The close-up was asked for from the registry row of this house (-1: no): the panel offers the way back. */
  fromList: -1,
  /** Side the dial panel stands on; the copy and the camera's frame take the other. */
  panel: "r" as "r" | "l",
  /** Part of the viewport the panel and the copy leave free (fractions x0, y0, x1, y1); null without the dial. */
  free: null as null | [number, number, number, number],
  /** Close-up amount (0..1) and the house it frames, for the light's shadow fit. Written by the scene. */
  zoom: 0,
  zoomAt: [0, 0, 0] as [number, number, number],
  /** Dial override (null = follow scroll). */
  dialHour: null as number | null,
  /** The dial is on screen (and its hour, once set, drives the scene). */
  dialOn: false,
  tone: "light" as "light" | "dark",
  /** Loader milestones reached (0..12). */
  load: 0,
  ready: false,
  /** Frozen render for still capture (?still=<chapter>). */
  still: -1,
};

const listeners = new Map<Events, Set<() => void>>();

export function on(evt: Events, fn: () => void) {
  let set = listeners.get(evt);
  if (!set) listeners.set(evt, (set = new Set()));
  set.add(fn);
  return () => {
    set!.delete(fn);
  };
}

export function emit(evt: Events) {
  listeners.get(evt)?.forEach((fn) => fn());
}

export function addLoad(units: number) {
  store.load = Math.min(12, store.load + units);
  emit("load");
}
