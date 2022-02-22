import getPgClient from "@utils/getPgClient";
import { useEffect } from "react";

const Page = ({ matches }) => {
  useEffect(() => {
    console.log(matches);
  }, []);

  return <div>Admin</div>;
};

export const getServerSideProps = async () => {
  const client = getPgClient();
  await client.connect();
  const query = await client.query("select * from stats group by match_id");
  await client.end();

  return {
    props: {
      matches: query.rows
    }
  };
};

export default Page;
