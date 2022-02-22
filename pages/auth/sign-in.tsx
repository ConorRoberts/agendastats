import React, { useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import LoadingScreen from "@components/LoadingScreen";
import { getAuth, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { Google } from "@components/Icons";
import Meta from "@components/Meta";
import useAuth from "hooks/useAuth";

const providers = {
  google: {
    provider: new GoogleAuthProvider(),
    Icon: Google
  }
};

const Login = () => {
  const router = useRouter();
  const firebaseAuth = getAuth();
  const [auth] = useAuth();

  const signIn = async (provider: any) => {
    try {
      await signInWithRedirect(firebaseAuth, provider);
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    // There exists a user. Create one in db.
    if (auth) router.push("/");
  }, [auth, router]);

  // User is loading or user exists
  if (auth) return <LoadingScreen />;

  return (
    <div className="flex items-center justify-center flex-1">
      <Meta title="Login" />
      <div className="w-full max-w-sm rounded-lg mx-2 bg-white dark:bg-gray-800 shadow-center-sm overflow-hidden">
        <div className="bg-blue-500 dark:bg-gray-700 px-4 py-6">
          <h3 className="text-center font-light text-3xl text-white">Login</h3>
        </div>
        <div className="px-4 py-8">
          {Object.entries(providers).map(
            ([providerName, { provider, Icon }]) => (
              <div
                onClick={() => signIn(provider)}
                key={providerName}
                className="background-hover py-3 px-4 flex items-center gap-4 rounded-md"
              >
                {Icon && <Icon className="w-8 h-8" />}
                <p className="capitalize text-lg">{providerName}</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
