import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { WalletProvider } from "@/components/wallet-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { AutoConnectProvider } from "@/components/auto-connect-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Login - Your App",
  description: "Sign in to your account",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 dark:bg-gray-900`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AutoConnectProvider>
            <WalletProvider>
              {children}
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "var(--toast-bg)",
                    color: "var(--toast-color)",
                  },
                  className: "dark:bg-gray-800 dark:text-white",
                }}
              />
            </WalletProvider>
          </AutoConnectProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
