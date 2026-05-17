"use client";

import { useEffect, useState } from "react";
import { getAttendees } from "@/lib/sheets";
import { Button } from "@/components/ui/button";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import QRCode from "qrcode";


export default function QRGeneratorPage() {
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    getAttendees()
      .then(setAttendees)
      .finally(() => setLoading(false));
  }, []);

  const handleExportZip = async () => {
  try {
    setExporting(true);

    const zip = new JSZip();

    // 👇 chunk size (tune between 50–150 depending on device)
    const CHUNK_SIZE = 100;

    for (let i = 0; i < attendees.length; i += CHUNK_SIZE) {
      const chunk = attendees.slice(i, i + CHUNK_SIZE);

      console.log(
        `Processing chunk ${i / CHUNK_SIZE + 1} / ${Math.ceil(
          attendees.length / CHUNK_SIZE
        )}`
      );

      await Promise.all(
        chunk.map(async (attendee) => {
          const dataUrl = await QRCode.toDataURL(attendee.badge_id, {
            width: 600,
            margin: 1,
          });

          const base64Data = dataUrl.split(",")[1];

          const blob = await fetch(
            `data:image/png;base64,${base64Data}`
          ).then((res) => res.blob());

          zip.file(`${attendee.badge_id}.png`, blob);
        })
      );

      // 👇 small breathing delay prevents UI freeze
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    const content = await zip.generateAsync(
      {
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 6,
        },
      },
      (metadata) => {
        console.log(`ZIP progress: ${metadata.percent.toFixed(2)}%`);
      }
    );

    saveAs(content, "event-qr-codes.zip");
  } catch (err) {
    console.error("ZIP export failed:", err);
  } finally {
    setExporting(false);
  }
};

  if (loading) {
    return <p className="p-8">Loading attendees...</p>;
  }

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-2xl font-bold">
          Badge List ({attendees.length})
        </h1>

        {/* <Button onClick={handleExportZip} disabled={exporting}>
          {exporting ? "Generating ZIP..." : "Download QR ZIP"}
        </Button> */}
      </div>

      {/* LIST VIEW (FAST + SCALABLE) */}
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Badge ID</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {attendees.map((a) => (
              <tr key={a.badge_id} className="border-t">
                <td className="p-3 font-mono">{a.badge_id}</td>

                <td className="p-3">
                  {a.checked_in ? (
                    <span className="text-green-600 font-medium">
                      Checked In
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      Not checked in
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}