import { Shell } from "@/components/damar/shell/Shell";

export default function DamarEnglish({ children }: { children: React.ReactNode }) {
  return <Shell locale="en">{children}</Shell>;
}
