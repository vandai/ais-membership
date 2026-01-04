import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIS Membership Panel",
  description: "Arsenal Indonesia Supporter Member Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-bg-grey text-dark-navy`}
      >
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 md:ml-64 pb-20 md:pb-0">
            <div className="max-w-[1200px] mx-auto p-4 md:p-6 w-full">
              {children}
            </div>
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
