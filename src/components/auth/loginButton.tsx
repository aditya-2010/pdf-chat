"use client";

import { useRouter } from "next/navigation";
import React from "react";

type LoginButtonProps = {
  children: React.ReactNode;
  asChild?: boolean;
  mode?: "modal" | "redirect";
};

function LoginButton({
  children,
  asChild,
  mode = "redirect",
}: LoginButtonProps) {
  const router = useRouter();

  function onClick() {
    router.push("/auth/login");
  }

  if (mode === "modal") {
    return <p>TODO modal</p>;
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
}

export default LoginButton;
