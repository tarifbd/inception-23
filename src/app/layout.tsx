import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "INCEPTION 23 | Strategic Advisory",
  description: "Strategic Clarity for Leaders. Business Advisory, Legal Support, and IT Solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans relative" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
