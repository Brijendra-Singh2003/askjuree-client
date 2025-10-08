import React from "react";
import Navbar from "@/components/Navbar";

function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default Providers;
