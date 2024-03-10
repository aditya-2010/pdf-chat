"use client";

import { createUser } from "@/actions/createUser";
import { getUserByEmail } from "@/data/user";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type UserType = {
  id: string;
  name: string;
  email: string;
};

export const AuthContext = createContext({
  user: { id: "", name: "User", email: "" },
  googleSignIn: () => {},
  logOut: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();

  const [user, setUser] = useState<UserType>({
    id: "",
    name: "User",
    email: "",
  });

  const googleSignIn = () => {
    console.log("Google signing in <<<<<<<");

    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const logOut = async () => {
    await signOut(auth);

    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (response.status === 200) {
      router.push("/");
    } else console.log("Error logging out from server");

    setUser({ id: "", email: "", name: "User" });
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (currUser) => {
      if (currUser && currUser.email) {
        // set context user
        setUser({
          id: currUser.uid,
          name: currUser.displayName ?? "User",
          email: currUser.email,
        });

        // check if user in saved in DB
        const dbUser = await getUserByEmail(currUser.email);
        // put user in DB
        if (!dbUser) {
          await createUser({
            id: currUser.uid,
            name: currUser.displayName ?? "User",
            email: currUser.email,
          });
        }

        // create user session in server
        await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${await currUser.getIdToken()}`,
          },
        }).then((response) => {
          if (response.status === 200) {
            router.push("/dashboard");
          }
        });
      } else {
        setUser({ id: "", email: "", name: "User" });
      }
    });

    // return () => unsubscribe();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("AuthContext accessed outside of AuthContextProvider");
  }
  return context;
};
