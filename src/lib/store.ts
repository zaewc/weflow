import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import type {
  NewSubmission,
  Submission,
  SubmissionStatus,
} from "@/lib/types";

// 저장소 전략:
//  - Vercel(서버리스) 배포: Upstash Redis 사용 (영속).
//    Vercel Marketplace의 Upstash 통합이 환경변수를 자동 주입합니다.
//  - 로컬 개발: 환경변수가 없으면 data/submissions.json 파일로 자동 폴백.

const SUBS_INDEX = "weflow:subs"; // sorted set (score = createdAt ms)
const subKey = (id: string) => `weflow:sub:${id}`;

function getRedis(): Redis | null {
  const url =
    process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function makeId(): string {
  const rand = Math.floor(Math.random() * 1e9).toString(36);
  return `${Date.now().toString(36)}-${rand}`;
}

function buildSubmission(input: NewSubmission): Submission {
  return {
    ...input,
    id: makeId(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}

function sortNewestFirst(items: Submission[]): Submission[] {
  return [...items].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

// ---------------------------------------------------------------------------
// 파일 기반 폴백 (로컬 개발용)
// ---------------------------------------------------------------------------
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "submissions.json");

async function fileReadAll(): Promise<Submission[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Submission[]) : [];
  } catch {
    return [];
  }
}

async function fileWriteAll(items: Submission[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
}

// ---------------------------------------------------------------------------
// 공개 API (라우트 핸들러에서 사용)
// ---------------------------------------------------------------------------
export async function listSubmissions(): Promise<Submission[]> {
  const redis = getRedis();
  if (!redis) {
    return sortNewestFirst(await fileReadAll());
  }
  const ids = await redis.zrange<string[]>(SUBS_INDEX, 0, -1, { rev: true });
  if (ids.length === 0) return [];
  const pipeline = redis.pipeline();
  ids.forEach((id) => pipeline.hgetall(subKey(id)));
  const rows = (await pipeline.exec()) as (Submission | null)[];
  return rows.filter((r): r is Submission => r !== null);
}

export async function createSubmission(
  input: NewSubmission,
): Promise<Submission> {
  const submission = buildSubmission(input);
  const redis = getRedis();
  if (!redis) {
    const items = await fileReadAll();
    items.push(submission);
    await fileWriteAll(items);
    return submission;
  }
  await redis.hset(subKey(submission.id), { ...submission });
  await redis.zadd(SUBS_INDEX, {
    score: new Date(submission.createdAt).getTime(),
    member: submission.id,
  });
  return submission;
}

export async function updateStatus(
  id: string,
  status: SubmissionStatus,
): Promise<Submission | null> {
  const redis = getRedis();
  if (!redis) {
    const items = await fileReadAll();
    const target = items.find((item) => item.id === id);
    if (!target) return null;
    target.status = status;
    await fileWriteAll(items);
    return target;
  }
  const raw = await redis.hgetall(subKey(id));
  if (!raw || typeof raw.id !== "string") return null;
  const existing = raw as unknown as Submission;
  await redis.hset(subKey(id), { status });
  return { ...existing, status };
}

export async function deleteSubmission(id: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) {
    const items = await fileReadAll();
    const next = items.filter((item) => item.id !== id);
    if (next.length === items.length) return false;
    await fileWriteAll(next);
    return true;
  }
  const removed = await redis.zrem(SUBS_INDEX, id);
  await redis.del(subKey(id));
  return removed > 0;
}
