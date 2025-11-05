import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SQL Learn - Escola de Dados",
  description: "Interactive SQL learning platform with hands-on challenges",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
