/*--------------------------------------------------------------------------------------------------------------------*/
import Script from "next/script";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import "./globals.css";

/*--------------------------------------------------------------------------------------------------------------------*/
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const isProduction = process.env.NODE_ENV === "production";

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

const title = "Prism - Flow Blockchain Explorer";
/*--------------------------------------------------------------------------------------------------------------------*/
export const metadata: Metadata = {
  title,
  description: "Explore the full spectrum of Flow blockchain data with Prism",
};

/*--------------------------------------------------------------------------------------------------------------------*/
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const trackerEnabled = GA_ID && isProduction;
  return (
    <html lang="en" className="dark">
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head title={title}>
        {trackerEnabled && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>

      <body
        className={cn(
          inter.variable,
          "bg-prism-level-1 text-prism-text antialiased",
        )}
      >
        {children}
      </body>
    </html>
  );
}
