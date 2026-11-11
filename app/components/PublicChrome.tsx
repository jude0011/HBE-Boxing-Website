"use client";

import { usePathname } from "next/navigation";

import Header from "./Header";
import Footer from "./Footer";

export default function PublicChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname =
    usePathname();

  /*
    HIDE PUBLIC WEBSITE CHROME
    FROM ALL ADMIN ROUTES
  */
  const hidePublicChrome =
    pathname === "/admin" ||
    pathname.startsWith(
      "/admin/"
    );

  if (
    hidePublicChrome
  ) {
    return (
      <>
        {children}
      </>
    );
  }

  return (
    <>
      <Header />

      {children}

      <Footer />
    </>
  );
}