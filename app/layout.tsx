import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "El Califa | Tacos de Verdad, Desde 1987",
  description: "Carne asada, al pastor, y barbacoa perfeccionados a través de décadas de tradición en la Ciudad de México. 8 ubicaciones para servirte.",
  keywords: ["tacos", "México", "CDMX", "al pastor", "carne asada", "barbacoa", "restaurante mexicano"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${dmSans.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
