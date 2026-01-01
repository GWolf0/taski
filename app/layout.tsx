import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { APP_NAME } from "@/constants/app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${APP_NAME}`,
  description: "Tasks manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* // bootstrap icons */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"></link>

        {/* // favicon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* // Initial theme checking script */}
        <Script id="theme_init">
          {
            `(function() {
              if (typeof window !== 'undefined') {
                try {
                  let theme = localStorage.getItem("theme");
                  if(!theme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    theme = "dark";
                  }
                  if (theme === "dark") {
                    document.documentElement.classList.add("dark");
                  } else {
                    document.documentElement.classList.remove("dark");
                  }
                } catch (e) { console.error("Couldn't initialize theme."); }
              }
              document.body.classList.remove("hidden");
            })();`
          }
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased hidden`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
