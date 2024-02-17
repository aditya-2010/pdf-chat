import { ArrowRight } from "lucide-react";
import { LuLogOut } from "react-icons/lu";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import LoginButton from "./auth/loginButton";
import { Button, buttonVariants } from "./ui/button";
import { auth, signOut } from "@/auth";

async function Navbar() {
  const session = await auth();

  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-16 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex z-40 font-semibold">
            PDF-GPT
          </Link>

          {/* TODO: add mobile navbar */}

          {!session && (
            <div className="hidden items-center space-x-4 sm:flex">
              <>
                <Link
                  href="/pricing"
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  Pricing
                </Link>
                <LoginButton>
                  <Button variant="secondary">Log in</Button>
                </LoginButton>
                <Link href="/auth/register">
                  <Button>
                    Get Started <ArrowRight className="ml-1 w-5 h-5" />
                  </Button>
                </Link>
              </>
            </div>
          )}
          {session && (
            <div>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button variant="secondary">
                  Sign Out <LuLogOut className="ml-1 w-5 h-5" />
                </Button>
              </form>
            </div>
          )}
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}

export default Navbar;
