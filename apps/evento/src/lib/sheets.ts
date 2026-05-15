export type CheckInResult =
  | { status: "success"; badge_id: string }
  | { status: "already_checked_in"; badge_id: string }
  | { status: "not_found" }
  | { status: "error"; message: string };

export type Attendee = {
  badge_id: string;
  checked_in: boolean;
  timestamp: string;
};

export type ScanningHistoryRecord = {
  badge_id: string;
  checked_in: boolean;
  timestamp: string;
};

/* -----------------------------
   CHECK-IN
------------------------------*/

export async function checkInAttendee(
  badgeId: string
): Promise<CheckInResult> {
  try {
    const res = await fetch("/api/checkin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        badge_id: badgeId,
      }),
    });

    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch {
      return {
        status: "error",
        message: "Invalid server response",
      };
    }
  } catch {
    return {
      status: "error",
      message: "Network error",
    };
  }
}

/* -----------------------------
   ATTENDEES LIST
------------------------------*/

export async function getAttendees(): Promise<Attendee[]> {
  const res = await fetch("/api/attendees");
  return await res.json();
}

/* -----------------------------
   SCANNING HISTORY (NEW)
------------------------------*/

export async function getRecentCheckIns(): Promise<
  ScanningHistoryRecord[]
> {
  try {
    const res = await fetch("/api/getScanningHistory");

    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch {
      console.error("Invalid JSON from scanning history:", text);
      return [];
    }
  } catch {
    return [];
  }
}