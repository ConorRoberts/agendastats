import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LoadingScreen from "@components/LoadingScreen";
import { getDoc, doc, getFirestore } from "@firebase/firestore";
import useAuth from "hooks/useAuth";

export interface RequireAuthProps {
  children: any;
  allowRoles?: string[];
}

const RequireAuth = ({ children, allowRoles }: RequireAuthProps) => {
  const router = useRouter();

  const [user, loading] = useAuth();
  const [checksPass, setChecksPass] = useState(false);

  useEffect(() => {
    (async () => {

      // If the user is loading, we don't want to do anything
      if (loading) return;

      if (!user) throw new Error("No user found");

      const db = getFirestore();

      try {
        // Get the user document
        const docRef = doc(db, `users/${user.uid}`);
        const userDoc = await getDoc(docRef);
        if (userDoc.exists()) {
          const { role } = userDoc.data();

          // If the user is an admin or is of a valid role, we're good
          if (role === "admin" || (allowRoles?.length && allowRoles?.includes(role)) || allowRoles?.length === 0 || !allowRoles)
            setChecksPass(true);
          else
            throw new Error("Checks did not pass.");
        } else {
          throw Error("User document does not exist");
        }
      } catch (error) {
        router.push("/error/403");
      }

    })();

  }, [user, router, allowRoles, loading]);


  if (checksPass) return children;

  return <LoadingScreen />;
};

export default RequireAuth;