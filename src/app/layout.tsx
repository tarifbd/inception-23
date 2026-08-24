import type { Metadata } from "next";
import "./globals.css";
import { ConditionalFluidCursor } from "@/components/ui/ConditionalFluidCursor";

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
    // suppressHydrationWarning is critical here. 
    // It prevents crashes caused by browser extensions (like the bis_skin_checked error)
    // and dark mode/language mismatches on initial load.
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans relative" suppressHydrationWarning>
        <ConditionalFluidCursor />
        {children}
      </body>
    </html>
  );
}
