import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beyond Work — AJ Adversalo",
  description: "Personal projects and after-hours work by AJ Adversalo.",
};

export default function BeyondWorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
