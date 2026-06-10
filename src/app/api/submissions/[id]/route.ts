import { NextRequest, NextResponse } from "next/server";
import { deleteSubmission, updateStatus } from "@/lib/store";
import { isAuthorized } from "@/lib/auth";
import type { SubmissionStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const VALID_STATUS: SubmissionStatus[] = ["pending", "in_progress", "done"];

interface RouteContext {
  params: { id: string };
}

// 관리자: 상태 변경
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
  }

  const status = (payload as { status?: unknown }).status;
  if (
    typeof status !== "string" ||
    !VALID_STATUS.includes(status as SubmissionStatus)
  ) {
    return NextResponse.json({ error: "잘못된 상태값" }, { status: 400 });
  }

  const updated = await updateStatus(params.id, status as SubmissionStatus);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ item: updated });
}

// 관리자: 삭제
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const ok = await deleteSubmission(params.id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
