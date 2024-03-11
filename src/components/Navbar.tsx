"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Button, buttonVariants } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { usePathname } from "next/navigation";

function Navbar() {
  const { user, googleSignIn, logOut } = useAuth();

  const toast = useToast();

  const pathname = usePathname();

  const handleLogin = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      logOut();
      console.log(error);
      toast.toast({
        title: "Error signing in",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      console.log("logging out");
    } catch (error) {
      console.log(error);
      toast.toast({
        title: "Something went wrong",
        description: "Could not Log out",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-16 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex z-40 font-semibold">
            PDFChat
          </Link>
          <div>
            {!user.id ? (
              <Button onClick={handleLogin}>
                <span className="mr-1">Log In with</span>{" "}
                <FaGoogle className="w-4 h-4" />
              </Button>
            ) : (
              <>
                {pathname === "/" ? (
                  <Link
                    className={buttonVariants({
                      variant: "default",
                      className: "mr-4",
                    })}
                    href="/dashboard"
                  >
                    Go to Dashboard
                  </Link>
                ) : null}
                <Button variant="secondary" onClick={handleLogout}>
                  Logout <LuLogOut className="ml-1 w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* TODO: add email login */}
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}

export default Navbar;
