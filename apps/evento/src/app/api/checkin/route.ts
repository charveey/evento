const WEBHOOK_URL = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL!;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      body: JSON.stringify(body),
    });

    const text = await res.text();

    return new Response(text, {
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (err: any) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: err.message,
      }),
      { status: 500 }
    );
  }
}