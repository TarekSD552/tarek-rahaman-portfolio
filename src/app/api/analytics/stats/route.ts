import { NextResponse } from "next/server";
import { getAnalyticsSummary, AnalyticsQueryOptions } from "@/lib/analytics-db";
import { isRequestAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const isAuthed = await isRequestAuthenticated(request);
    if (!isAuthed) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Administrator session required to view website analytics." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const range = (searchParams.get("range") || "7d") as AnalyticsQueryOptions["range"];
    const startDate = searchParams.get("from") || undefined;
    const endDate = searchParams.get("to") || undefined;

    const data = await getAnalyticsSummary({
      range,
      startDate,
      endDate,
    });

    return NextResponse.json(
      { success: true, data },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          Pragma: "no-cache",
        },
      }
    );
  } catch (err: any) {
    console.error("[Analytics Stats API Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load analytics statistics" },
      { status: 500 }
    );
  }
}
