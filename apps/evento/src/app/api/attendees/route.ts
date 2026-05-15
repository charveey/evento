const WEBHOOK_URL = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL!;

export async function GET() {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "GET",
      cache: "no-store",
    });

    const text = await res.text();

    // detect bad response (HTML from Apps Script)
    if (!text.trim().startsWith("[")) {
      console.error("Invalid Apps Script response:", text);

      return Response.json(
        { error: "Invalid response from Sheets backend" },
        { status: 500 }
      );
    }

    const data = JSON.parse(text);

    return Response.json(data);
  } catch (err) {
    console.error("Attendees API error:", err);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}