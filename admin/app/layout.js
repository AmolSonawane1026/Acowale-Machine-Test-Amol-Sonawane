import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
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
  title: "Acowale CRM",
  description: "Acowale CRM System",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <AuthProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3500,
              style: {
                background: "rgba(10, 12, 24, 0.95)",
                color: "#e8eaed",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                fontSize: "14px",
              },
              success: {
                iconTheme: { primary: "#10b981", secondary: "#05060f" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#05060f" },
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
