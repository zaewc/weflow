import { NextRequest, NextResponse } from "next/server";
import { deleteCase, updateCase } from "@/lib/store";
import { parseCaseInput } from "@/lib/cases";
import { isAuthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: { slug: string };
}

// 관리자: 성공사례 수정
export async function PATCH(req: NextRequest, { params }: RouteContext) {
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

  const updated = await updateCase(params.slug, result.data);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ item: updated });
}

// 관리자: 성공사례 삭제
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const ok = await deleteCase(params.slug);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
