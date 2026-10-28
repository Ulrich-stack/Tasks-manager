import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Sibebar from "./ui/Sibebar";
import ThemeRegistry from "./ui/ThemeRegistry";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Tasks",
  description: "Plan your day, organize tasks by category and track progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans antialiased">
        <ThemeRegistry>
          <div className="md:flex h-screen overflow-hidden text-sm">
            <Sibebar />
            <main className="flex-1 h-full overflow-y-auto">{children}</main>
          </div>
        </ThemeRegistry>
      </body>
    </html>
  );
}
