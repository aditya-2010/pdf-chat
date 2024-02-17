import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import React from "react";

const font = Poppins({ subsets: ["latin"], weight: "600" });

type headerProps = { label: string };

function Header({ label }: headerProps) {
  return (
    <div className="w-full flex flex-col gap-y-4 justify-center items-center">
      <h1 className={cn("text-3xl font-semibold", font.className)}>🔐 Auth</h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}

export default Header;
