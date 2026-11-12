import { NextResponse } from "next/server";
import { resetAnalyticsData } from "@/lib/analytics-db";
import { isRequestAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const isAuthed = await isRequestAuthenticated(request);
    if (!isAuthed) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Administrator session required." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const mode = body.mode === "today" ? "today" : "all";

    await resetAnalyticsData(mode);

    return NextResponse.json({
      success: true,
      message: mode === "today" ? "Today's test data has been cleared." : "All analytics data has been reset.",
    });
  } catch (err: any) {
    console.error("[Analytics Reset API Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to reset analytics" },
      { status: 500 }
    );
  }
}
