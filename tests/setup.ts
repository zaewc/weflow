import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// next/navigation 모킹 — pathname은 globalThis로 제어
declare global {
  // eslint-disable-next-line no-var
  var __pathname: string | undefined;
}

vi.mock("next/navigation", () => ({
  usePathname: () => globalThis.__pathname ?? "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  redirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  },
}));

// next/link 모킹 — 단순 앵커로 렌더
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  } & Record<string, unknown>) => {
    const React = require("react");
    return React.createElement("a", { href, ...rest }, children);
  },
}));

afterEach(() => {
  cleanup();
  globalThis.__pathname = undefined;
});
