import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import ThemeProvider from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster"
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans"
});
export const metadata: Metadata = {
  title: "QueueManager",
  description: "Handle Queue Management",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
