import { mergeClasses } from "@/lib/utils";
import { ReactNode } from "react";

export default function MaxWidthWrapper({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={mergeClasses(
        "mx-auto w-full max-w-screen-xl px-2.5 md:px-2",
        className
      )}
    >
      {children}
    </div>
  );
}
