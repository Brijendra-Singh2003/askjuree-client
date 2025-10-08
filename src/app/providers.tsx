"use client";

import React from "react";
import SessionProvider from "@/context/session";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/constants";

function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  );
}

export default Providers;
