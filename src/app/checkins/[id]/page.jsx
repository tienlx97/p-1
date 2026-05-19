import { MemoryDetailPage } from "@/features/memory";

export default function CheckinDetailPage({ params }) {
  return <MemoryDetailPage id={params.id} />;
}
