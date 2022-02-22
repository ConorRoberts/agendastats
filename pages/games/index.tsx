import useAuth from "@hooks/useAuth";
import useRole from "@hooks/useRole";
import getPgClient from "@utils/getPgClient";
import { useEffect } from "react";

const Page = ({ data }) => {
  const [user] = useAuth();
  const [role] = useRole();
  useEffect(() => {
    console.log(role);
  }, [role]);
  return <div>Games</div>;
};

export const getServerSideProps = async () => {
  const client = getPgClient();

  await client.connect();

  const query = await client.query("select distinct match_id,match_type,timestamp from stats");

  await client.end();

  return {
    props: {
      data: query.rows
    }
  };
};

export default Page;
