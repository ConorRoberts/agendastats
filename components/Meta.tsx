import React from "react";
import Head from "next/head";
import { APP_NAME } from "@config/config";

export interface HeaderProps {
    title: string;
    children?: any;
}

const Meta = ({ title, ...props }: HeaderProps) => {

  // const colour = darkMode ? '#000000' : '#ffffff';

  return (
    <Head>
      <title>{`${title} - ${APP_NAME}`}</title>
      {/* <meta name="theme-color" content={colour} /> */}
      {props?.children && props.children}
    </Head>
  );
};

export default Meta;
