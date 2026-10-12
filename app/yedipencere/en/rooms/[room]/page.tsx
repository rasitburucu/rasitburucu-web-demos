import { notFound } from "next/navigation";
import { isRoomId, ROOM_IDS } from "@/lib/yedipencere/house";
import { roomMeta } from "@/lib/yedipencere/meta";
import { rooms } from "@/content/yedipencere/rooms";
import { RoomPage } from "@/components/yedipencere/pages/RoomPage";

export const dynamicParams = false;
export function generateStaticParams() {
  return ROOM_IDS.map((room) => ({ room }));
}

export async function generateMetadata({ params }: { params: Promise<{ room: string }> }) {
  const { room } = await params;
  if (!isRoomId(room)) return {};
  return roomMeta("en", room, rooms.en[room].lead);
}

export default async function Page({ params }: { params: Promise<{ room: string }> }) {
  const { room } = await params;
  if (!isRoomId(room)) notFound();
  return <RoomPage room={room} lang="en" />;
}
