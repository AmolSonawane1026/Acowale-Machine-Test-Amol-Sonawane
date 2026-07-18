import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Acowale - Customer Feedback Platform",
  description:
    "Submit your feedback and help us improve. Acowale - Lightweight customer feedback platform.",
  keywords: ["feedback", "CRM", "customer", "Acowale"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "rgba(15, 15, 25, 0.95)",
              color: "#ededed",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#0a0a0f" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#0a0a0f" },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
