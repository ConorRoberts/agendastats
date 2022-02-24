import Navigation from "@components/Navigation";
import { APP_NAME } from "@config/config";
import Head from "next/head";
import "../styles/globals.css";
import firebaseConfig from "@config/firebase";
import { initializeApp } from "@firebase/app";
import StateManager from "@components/StateManager";

initializeApp(firebaseConfig);

const MyApp = ({ Component, pageProps }) => {
  return (
    <div>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Tracking Global Agenda statistics since 2022." />
        <meta name="keywords" content="Global Agenda, Agendastats, Gaming" />
        <title>{APP_NAME}</title>

        <link rel="manifest" href="/manifest.json" />
        <link
          href="/icons/favicon-16x16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/favicon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <div className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white min-h-screen md:pt-24 pb-24 md:pb-0 relative flex flex-col" id="app">
        <StateManager />
        <Navigation />
        <Component {...pageProps} />
      </div>
    </div>
  );
};

export default MyApp;