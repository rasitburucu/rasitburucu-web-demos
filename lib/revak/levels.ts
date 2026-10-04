// The four levels, in a plain module so server components can read them
// (store.tsx is a client module; its exports are references on the server).
export type Kademe = "anaokulu" | "ilkokul" | "ortaokul" | "lise";
export const KADEMELER: Kademe[] = ["anaokulu", "ilkokul", "ortaokul", "lise"];
export const isKademe = (v: unknown): v is Kademe => typeof v === "string" && (KADEMELER as string[]).includes(v);
