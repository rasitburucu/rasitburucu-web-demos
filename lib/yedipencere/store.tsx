"use client";

// One stay and one arrival plan for the whole visit: the first screen, the
// room pages, the arrival strip and the booking summary read and write the
// same state. Kept in sessionStorage (nothing leaves the browser). A link with
// ?oda=korfez&giris=2026-10-16&gece=2&kisi=2 opens that stay.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { defaultCheckIn } from "./availability";
import { BUILD_TODAY, diffDays, isIso, localToday } from "./dates";
import { EXTRA_GUEST, isRoomId, MAX_GUESTS, MAX_NIGHTS, ROOM, type RoomId } from "./house";
import { isModeId, isStartId, MODES, type ModeId, type StartId } from "./arrival";

export type Stay = { checkIn: string; nights: number; guests: number; room: RoomId };
export type Trip = { mode: ModeId; start: StartId; luggage: boolean };

const KEY = "yedipencere-v1";

const clampNights = (n: number) => Math.max(1, Math.min(MAX_NIGHTS, Math.round(n) || 1));
const clampGuests = (n: number) => Math.max(1, Math.min(MAX_GUESTS, Math.round(n) || 1));

export const initialStay = (today = BUILD_TODAY): Stay => ({ checkIn: defaultCheckIn(today), nights: 2, guests: 2, room: "korfez" });
const initialTrip: Trip = { mode: "havalimani", start: "kalekapisi", luggage: false };

type Ctx = {
  stay: Stay;
  setStay: (patch: Partial<Stay>) => void;
  trip: Trip;
  setTrip: (patch: Partial<Trip>) => void;
  /** Local "today"; the build date until the browser has mounted. */
  today: string;
  /** True after the first client render: used to hold back entrance motion. */
  ready: boolean;
  /** The date sheet (calendar, nights, guests). */
  sheet: boolean;
  setSheet: (open: boolean) => void;
};

const StayCtx = createContext<Ctx | null>(null);

function sanitize(raw: Partial<Stay>, today: string, base: Stay): Stay {
  const s = { ...base };
  if (isRoomId(raw.room)) s.room = raw.room;
  if (typeof raw.nights === "number") s.nights = clampNights(raw.nights);
  if (typeof raw.guests === "number") s.guests = clampGuests(raw.guests);
  if (isIso(raw.checkIn) && diffDays(today, raw.checkIn) >= 0 && diffDays(today, raw.checkIn) <= 365) s.checkIn = raw.checkIn;
  return s;
}

export function StayProvider({ children }: { children: React.ReactNode }) {
  const [stay, setStayState] = useState<Stay>(() => initialStay());
  const [trip, setTripState] = useState<Trip>(initialTrip);
  const [today, setToday] = useState(BUILD_TODAY);
  const [ready, setReady] = useState(false);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    const t = localToday();
    setToday(t);
    let next = initialStay(t);
    let nextTrip = initialTrip;
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { stay?: Partial<Stay>; trip?: Partial<Trip> };
        if (saved.stay) next = sanitize(saved.stay, t, next);
        if (saved.trip) {
          const tr = saved.trip;
          const mode = isModeId(tr.mode) ? tr.mode : nextTrip.mode;
          const start = isStartId(tr.start) && MODES[mode].includes(tr.start) ? tr.start : MODES[mode][0];
          nextTrip = { mode, start, luggage: tr.luggage === true };
        }
      }
    } catch {
      /* private mode or a broken entry: start fresh */
    }
    const q = new URLSearchParams(window.location.search);
    const fromUrl: Partial<Stay> = {};
    if (q.get("oda")) fromUrl.room = q.get("oda") as RoomId;
    if (q.get("giris")) fromUrl.checkIn = q.get("giris") ?? undefined;
    if (q.get("gece")) fromUrl.nights = Number(q.get("gece"));
    if (q.get("kisi")) fromUrl.guests = Number(q.get("kisi"));
    next = sanitize(fromUrl, t, next);
    const mode = q.get("yol");
    if (isModeId(mode)) nextTrip = { ...nextTrip, mode, start: MODES[mode][0] };
    // A one-off render of client-only data after mount; the static HTML holds the build-day defaults.
    setStayState(next);
    setTripState(nextTrip);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ stay, trip }));
    } catch {
      /* ignore */
    }
  }, [stay, trip, ready]);

  const setStay = useCallback((patch: Partial<Stay>) => {
    setStayState((s) => {
      const n = { ...s, ...patch };
      n.nights = clampNights(n.nights);
      n.guests = clampGuests(n.guests);
      return n;
    });
  }, []);

  const setTrip = useCallback((patch: Partial<Trip>) => {
    setTripState((t) => {
      const n = { ...t, ...patch };
      if (patch.mode && !patch.start) n.start = MODES[n.mode][0];
      if (!MODES[n.mode].includes(n.start)) n.start = MODES[n.mode][0];
      return n;
    });
  }, []);

  const value = useMemo(() => ({ stay, setStay, trip, setTrip, today, ready, sheet, setSheet }), [stay, setStay, trip, setTrip, today, ready, sheet]);
  return <StayCtx.Provider value={value}>{children}</StayCtx.Provider>;
}

export function useStay() {
  const c = useContext(StayCtx);
  if (!c) throw new Error("useStay outside StayProvider");
  return c;
}

/** Sample price for the stay: nights × room price, plus the third guest where the room takes one. */
export function priceOf(stay: Stay) {
  const r = ROOM[stay.room];
  const extraPerNight = stay.guests > 2 && r.capacity >= 3 ? EXTRA_GUEST : 0;
  const rooms = r.price * stay.nights;
  const extras = extraPerNight * stay.nights;
  return { perNight: r.price, extraPerNight, rooms, extras, total: rooms + extras, fits: stay.guests <= r.capacity };
}
