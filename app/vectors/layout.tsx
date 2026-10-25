import type { Metadata } from "next";
import { METADATA } from "../constants";

export const metadata: Metadata = {
  title: METADATA.vectorsTitle,
  description: METADATA.vectorsDescription,
  robots: { index: false, follow: false },
};

export default function VectorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
