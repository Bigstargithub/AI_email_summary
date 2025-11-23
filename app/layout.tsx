import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI 이메일 답장 생성기 | 빠르고 정확한 이메일 답장 작성",
  description: "받은 이메일 내용을 입력하면 AI가 한국어 비즈니스 문화에 맞는 완벽한 답장을 자동으로 작성해드립니다. 정중한, 캐주얼, 거절, 감사 등 다양한 톤으로 생성 가능합니다.",
  keywords: ["이메일", "답장", "AI", "자동 작성", "비즈니스 이메일", "한국어"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
