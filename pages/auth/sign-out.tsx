import React, { useEffect } from "react";
import LoadingScreen from "@components/LoadingScreen";
import { useRouter } from "next/router";
import { getAuth, signOut } from "@firebase/auth";
import useAuth from "hooks/useAuth";

const Logout = () => {

  const router = useRouter();
  const [auth] = useAuth();

  useEffect(() => {
    (async () => {
      const firebaseAuth = getAuth();
      await signOut(firebaseAuth);
    })();
  }, []);

  useEffect(() => {
    // No auth. Redirect elsewhere.
    if (!auth) router.push("/");
  }, [auth,router]);

  return <LoadingScreen />;
};

export default Logout;
