import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata = {
  title: "StartupForge",
  description: "Startup team builder",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-orange-500/20 selection:text-orange-500">
        <Providers>
          <Navbar/>
          {children}
          <Footer/>
        </Providers>
      </body>
    </html>
  );
}
