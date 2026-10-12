import { Shell } from "@/components/damar/shell/Shell";

export default function DamarTurkce({ children }: { children: React.ReactNode }) {
  return <Shell locale="tr">{children}</Shell>;
}
