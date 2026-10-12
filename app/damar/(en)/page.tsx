import type { Metadata } from "next";
import { en } from "@/content/damar/en";
import { HomePage } from "@/components/damar/pages/HomePage";
import { pageMeta } from "@/lib/damar/meta";

export const metadata: Metadata = pageMeta("en", "home", { title: en.meta.homeTitle, description: en.meta.homeDescription, absolute: true });

export default function DamarHome() {
  return <HomePage locale="en" />;
}
