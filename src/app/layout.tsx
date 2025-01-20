"use client";
// import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Provider } from "react-redux";
import store from "@/app/store/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManagedModal from "@/components/managed-modal/managed-modal";
// import ProtectedRoute from "@/components/layout/protected-route";
const inter = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-gray-900 text-white font-sans antialiased",
          inter.variable
        )}
      >
        <Provider store={store}>
          {/* <ProtectedRoute> */}
          {children}
          {/* </ProtectedRoute> */}
          <ToastContainer position="top-right" autoClose={5000} />
          <ManagedModal />
        </Provider>
      </body>
    </html>
  );
}
