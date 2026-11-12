import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCmsData, saveCmsData, updateCmsPartial } from "@/lib/cms-db";
import { isRequestAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getCmsData();
    return NextResponse.json(
      { success: true, data },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load CMS data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const isAuthed = await isRequestAuthenticated(request);
    if (!isAuthed) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Administrator session required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { data, partial } = body;

    let updatedData;
    if (partial) {
      updatedData = await updateCmsPartial(partial);
    } else if (data) {
      updatedData = await saveCmsData(data);
    } else {
      return NextResponse.json(
        { success: false, error: "No data payload provided" },
        { status: 400 }
      );
    }

    // Purge server cache across all public pages so changes appear immediately
    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
      revalidatePath("/about");
      revalidatePath("/services");
      revalidatePath("/skills");
      revalidatePath("/portfolio");
      revalidatePath("/contact");
    } catch (revalErr) {
      console.warn("Revalidation notice:", revalErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "CMS data updated successfully",
        data: updatedData,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to save CMS data" },
      { status: 500 }
    );
  }
}

