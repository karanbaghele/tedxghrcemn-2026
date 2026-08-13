import type { Metadata } from "next";
import { SiteShell } from "../components/SiteShell";

export const metadata: Metadata = {
  title: "TEDxGHRCEMN 2026 — 2nd Edition",
  description: "A two-day TEDx experience for ideas, practical learning and human connection in Nagpur.",
};

export default function HomePage() { return <SiteShell path="/" />; }
