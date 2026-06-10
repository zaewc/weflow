import { NextRequest, NextResponse } from "next/server";
import { createSubmission, listSubmissions } from "@/lib/store";
import { parseSubmission } from "@/lib/validation";
import { isAuthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

// 관리자: 전체 목록 조회
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const items = await listSubmissions();
  return NextResponse.json({ items });
}

// 공개: 예약 / 무료진단 접수
export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청 형식입니다." },
      { status: 400 },
    );
  }

  const result = parseSubmission(payload);
  if (!result.ok || !result.data) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const created = await createSubmission(result.data);
  return NextResponse.json({ item: created }, { status: 201 });
}
