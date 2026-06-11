import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "WEFLOW | 문의로 이어지는 홈페이지를 만듭니다",
  description:
    "홈페이지 제작부터 광고 연동·운영 관리까지. 단순 제작이 아닌 문의 구조까지 설계하는 WEFLOW.",
  metadataBase: new URL("https://weflowlab.kr"),
  icons: {
    icon: "/logo_icon.png",
    shortcut: "/logo_icon.png",
    apple: "/logo_icon.png",
  },
  openGraph: {
    title: "WEFLOW | 문의로 이어지는 홈페이지를 만듭니다",
    description:
      "랜딩·홈페이지 제작 · 광고 운영 · 검색 상단 노출 · 맞춤형 웹 솔루션",
    type: "website",
    images: ["/main_icon.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"
        />
      </head>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
