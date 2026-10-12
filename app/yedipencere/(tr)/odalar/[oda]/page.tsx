import { notFound } from "next/navigation";
import { isRoomId, ROOM_IDS } from "@/lib/yedipencere/house";
import { roomMeta } from "@/lib/yedipencere/meta";
import { rooms } from "@/content/yedipencere/rooms";
import { RoomPage } from "@/components/yedipencere/pages/RoomPage";

export const dynamicParams = false;
export function generateStaticParams() {
  return ROOM_IDS.map((oda) => ({ oda }));
}

export async function generateMetadata({ params }: { params: Promise<{ oda: string }> }) {
  const { oda } = await params;
  if (!isRoomId(oda)) return {};
  return roomMeta("tr", oda, rooms.tr[oda].lead);
}

export default async function Page({ params }: { params: Promise<{ oda: string }> }) {
  const { oda } = await params;
  if (!isRoomId(oda)) notFound();
  return <RoomPage room={oda} lang="tr" />;
}
