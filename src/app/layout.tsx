import { Geist, Geist_Mono, Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

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
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "600", "800"],
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
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased bg-prism-level-1 text-prism-text`}>{children}</body>
    </html>
  );
}
