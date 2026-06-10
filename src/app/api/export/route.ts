import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { listSubmissions } from "@/lib/store";
import { isAuthorized } from "@/lib/auth";
import { STATUS_LABEL, type Submission } from "@/lib/types";

export const dynamic = "force-dynamic";

function toRow(s: Submission): Record<string, string> {
  return {
    상태: STATUS_LABEL[s.status],
    이름: s.name,
    연락처: s.phone,
    제작종류: s.projectType,
    업종: s.industry,
    "희망 일정": s.schedule,
    추가요청사항: s.note,
    접수일: new Date(s.createdAt).toLocaleString("ko-KR"),
  };
}

// 관리자: 엑셀 다운로드 (?kind=reservation | inquiry | all)
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const kind = req.nextUrl.searchParams.get("kind") ?? "all";
  const all = await listSubmissions();
  const items =
    kind === "reservation" || kind === "inquiry"
      ? all.filter((s) => s.kind === kind)
      : all;

  const workbook = XLSX.utils.book_new();

  if (kind === "all") {
    const reservations = items.filter((s) => s.kind === "reservation");
    const inquiries = items.filter((s) => s.kind === "inquiry");
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(reservations.map(toRow)),
      "예약",
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(inquiries.map(toRow)),
      "문의",
    );
  } else {
    const sheetName = kind === "reservation" ? "예약" : "문의";
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(items.map(toRow)),
      sheetName,
    );
  }

  const buffer = XLSX.write(workbook, {
    type: "array",
    bookType: "xlsx",
  }) as ArrayBuffer;
  const body = new Uint8Array(buffer);

  const fileName = `weflow-${kind}-${Date.now()}.xlsx`;
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
