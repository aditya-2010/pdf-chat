import "@/app/globals.css";
import { PropsWithChildren } from "react";

function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      {children}
    </div>
  );
}

export default AuthLayout;
