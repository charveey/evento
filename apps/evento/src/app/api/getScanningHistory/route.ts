import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const WEBHOOK_URL = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL!;

export async function GET() {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "GET",
      cache: "no-store",
    });

    const text = await response.text();

    // console.log("RAW SHEETS RESPONSE:", text);

    let data: any;

    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("JSON parse error:", e);
      return NextResponse.json([], { status: 200 });
    }

    // ensure we always work with an array
    if (!Array.isArray(data)) {
      console.warn("Unexpected Sheets response shape:", data);
      return NextResponse.json([], { status: 200 });
    }

    const scanned = data.filter((a: any) => {
      return (
        a?.checked_in === true ||
        String(a?.checked_in).toLowerCase() === "true"
      );
    });

    const validScanned = scanned.filter((a: any) => {
      return (
        a?.timestamp &&
        !isNaN(new Date(a.timestamp).getTime())
      );
    });

    validScanned.sort(
      (a: any, b: any) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    );

    return NextResponse.json(validScanned);

  } catch (error) {
    console.error("getScanningHistory error:", error);

    // NEVER break frontend
    return NextResponse.json([], { status: 200 });
  }
}