import { NextRequest, NextResponse } from "next/server";
import { createCase, listCases } from "@/lib/store";
import { parseCaseInput } from "@/lib/cases";
import { isAuthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

// 공개: 성공사례 전체 목록
export async function GET() {
  const items = await listCases();
  return NextResponse.json({ items });
}

// 관리자: 성공사례 추가
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청 형식입니다." },
      { status: 400 },
    );
  }

  const result = parseCaseInput(payload);
  if (!result.ok || !result.data) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const created = await createCase(result.data);
  return NextResponse.json({ item: created }, { status: 201 });
}
