import { AuthProvider } from "@/app/context/AuthContext";
import Providers from "./providers";
import type { Metadata } from "next";
import { Titillium_Web } from "next/font/google";
import "./globals.css";

const font = Titillium_Web({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-titillium-web",
});

export const metadata: Metadata = {
  title: "Empire hotspot",
  description: "Plateforme de gestion des Wi-fi zones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${font.variable} h-full antialiased`}
    >
      <body className="font-poppins h-full min-h-screen w-full bg-gray-50 text-gray-900">
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}