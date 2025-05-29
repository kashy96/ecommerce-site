import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "./AuthProvider";
import { store } from "./store";
import { Provider } from "react-redux";
import AuthSync from "@/components/layouts/auth-sync";
import StoreProvider from "./StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const { SITE_NAME } = process.env;
export const metadata = {
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
     <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">   
      <StoreProvider>
          <AuthProvider>
              <AuthSync />
              {children}
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
