import PlayerStats from "@typedefs/PlayerStats";
import getPgClient from "@utils/getPgClient";
import { NextPageContext } from "next";
import { useEffect } from "react";

interface PageProps {
  data: PlayerStats[];
}

const Page = ({ data }: PageProps) => {
  useEffect(() => {
    console.log(data);
  }, []);
  return <div></div>;
};

export const getServerSideProps = async ({ query }: NextPageContext) => {
  const client = getPgClient();
  const id = query.id as string;

  await client.connect();

  const data = await client.query("select * from stats where match_id = $1", [
    id
  ]);

  await client.end();

  return {
    props: {
      data: data.rows
    }
  };
};

export default Page;
