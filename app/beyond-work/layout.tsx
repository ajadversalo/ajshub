import type { Metadata } from "next";
import { METADATA } from "../constants";

export const metadata: Metadata = {
  title: METADATA.beyondWorkTitle,
  description: METADATA.beyondWorkDescription,
};

export default function BeyondWorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
