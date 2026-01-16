import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Focus Reader | Leitura Dinâmica RSVP",
  description: "Treine sua velocidade de leitura com tecnologia RSVP. Cole qualquer texto e deixe as palavras fluírem no seu ritmo.",
  keywords: ["leitura dinâmica", "RSVP", "foco", "treino de leitura", "ORP"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-dark-950 text-white min-h-screen`}
      >
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
