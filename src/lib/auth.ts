import { NextRequest } from "next/server";

// 관리자 키 (배포 시 ADMIN_KEY 환경변수로 교체 권장)
export const ADMIN_KEY = process.env.ADMIN_KEY ?? "weflow2026";

export function isAuthorized(req: NextRequest): boolean {
  const header = req.headers.get("x-admin-key");
  return header === ADMIN_KEY;
}
