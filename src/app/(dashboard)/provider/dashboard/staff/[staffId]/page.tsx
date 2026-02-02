import { use } from "react";
import StaffDetail from "./staff-detail";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ staffId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { staffId } = await params;
  return {
    title: `Staff Details`,
    description: "View and manage staff member details",
  };
}

export default function StaffDetailPage({ params }: PageProps) {
  const { staffId } = use(params);
  return <StaffDetail staffId={staffId} />;
}
