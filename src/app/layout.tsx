import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { FCLProvider } from "@/fetch/provider";

/*--------------------------------------------------------------------------------------------------------------------*/
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
/*--------------------------------------------------------------------------------------------------------------------*/
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/*--------------------------------------------------------------------------------------------------------------------*/
export const metadata: Metadata = {
  title: "Prism - Flow Blockchain Explorer",
  description: "Explore the full spectrum of Flow blockchain data with Prism",
};

/*--------------------------------------------------------------------------------------------------------------------*/
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
        <FCLProvider>{children}</FCLProvider>
      </body>
    </html>
  );
}
