"use client";

import React from "react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Header />
      <div className={isAuthenticated ? "lg:pl-64" : ""}>
        <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
      </div>
      <Navbar />
    </>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutInner>{children}</LayoutInner>
    </AuthProvider>
  );
}
