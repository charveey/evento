"use client";

import AttendanceCard from "@/components/AttendanceCard";
import { getRecentCheckIns } from "@/lib/sheets";
import { useQuery } from "@tanstack/react-query";

type ScanningHistoryRecord = {
  badge_id: string;
  checked_in: boolean;
  timestamp: string;
};

const AttendanceHistory = () => {
  const {
    data,
    error,
    isLoading,
  } = useQuery<ScanningHistoryRecord[]>({
    queryKey: ["recentAttendanceRecords"],
    queryFn: getRecentCheckIns,
  });

  // HARD SAFETY: force array
  const recentAttendance: ScanningHistoryRecord[] = Array.isArray(data)
    ? data
    : [];

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    return <p>Error: {(error as Error).message}</p>;
  }

  const sorted = [...recentAttendance].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() -
      new Date(a.timestamp).getTime()
  );

  return (
    <section className="flex flex-col gap-2 h-full overflow-auto">
      {sorted.map((attendance, index) => (
        <AttendanceCard
          key={`${attendance.badge_id}-${index}`}
          result={{
            id: index,
            time: new Date(attendance.timestamp).toLocaleTimeString(),
            date: new Date(attendance.timestamp).toLocaleDateString(),
            scanned_by_email: "",
            school_id: attendance.badge_id,
            is_time_in: attendance.checked_in,
            student: {
              id: 0,
              first_name: "",
              last_name: "",
              school_id: attendance.badge_id,
              dept_id: 0,
              is_active: true,
              created_at: "",
            },
          }}
        />
      ))}
    </section>
  );
};

export default AttendanceHistory;