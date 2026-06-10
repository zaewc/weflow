"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingBar from "@/components/FloatingBar";

// 관리자 페이지(/admin)에서는 공용 헤더/푸터/하단바를 숨깁니다.
export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col has-bottom-bar">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingBar />
    </div>
  );
}
