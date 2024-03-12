"use client";

import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { UserButton, useAuth } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

function Navbar() {
  const { userId } = useAuth();

  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-16 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex z-40 font-semibold">
            PDFChat
          </Link>
          <div className="flex items-center gap-4">
            {!userId ? (
              <>
                <Link
                  href="/sign-up"
                  className={buttonVariants({ variant: "secondary" })}
                >
                  Sign Up
                </Link>
                <Link href="/sign-in" className={buttonVariants({})}>
                  Sign In <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </>
            ) : null}
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}

export default Navbar;
