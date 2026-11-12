"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(
  () => import("@/components/layout/CustomCursor"),
  { ssr: false }
);

const PortfolioChatAssistant = dynamic(
  () => import("@/components/chat/PortfolioChatAssistant"),
  { ssr: false }
);

export default function ClientOverlays() {
  return (
    <>
      <CustomCursor />
      <PortfolioChatAssistant />
    </>
  );
}

