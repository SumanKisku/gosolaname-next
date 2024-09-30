import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { EdgeStoreProvider } from "@/lib/edgestore";
import AppWalletProvider from "@/components/AppWalletProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GoSolanaMe",
  description: "GoSolanaMe is a fundraising campaing website where you can accept solana as donation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <EdgeStoreProvider>
          <AppWalletProvider>{children}</AppWalletProvider>
        </EdgeStoreProvider>
      </body>
    </html>
  );
}
