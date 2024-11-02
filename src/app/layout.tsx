import type { Metadata } from "next";
import localFont from "next/font/local";
import Navigation from "../components/header/navigation";
import { ThemeProvider } from "../components/theme-provider";
import ThemeToggle from "../components/theme-toggle";
import GridPattern from "../components/ui/grid-pattern";
import "./globals.css";

const geistSans = localFont({
  src: "../lib/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../lib/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Building Scalable Next.js Apps with SOLID Architecture",
  description:
    "Learn how to create a scalable and maintainable Next.js application by applying SOLID principles. Discover best practices for project structure, component design, authentication, server actions, and feature implementation. Improve your Next.js skills and build robust web applications.",
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
        <ThemeProvider>
          <Navigation />
          <GridPattern />
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
