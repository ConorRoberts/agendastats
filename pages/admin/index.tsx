import getPgClient from "@utils/getPgClient";
import _ from "lodash";
import JoinedMatchStats from "@typedefs/JoinedMatchStats";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Page = ({ matches }) => {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      router.push("/");
    }
  }, []);

  return (
    <div>
      <div className="flex flex-col divide-y divide-gray-300 mx-auto max-w-6xl">
        {Object.entries(matches).map(
          ([id, rows]: [id: string, rows: JoinedMatchStats[]]) => (
            <div key={`${id}`} className="py-3">
              <h3>{id}</h3>
              <p className="capitalize">{rows[0].match_type}</p>
              {rows.map((row, index) => (
                <div
                  key={`${row.match_id}${row.player_name}${index}`}
                  className="gap-4 grid grid-cols-5"
                >
                  <p>{new Date(row.timestamp).toLocaleDateString()}</p>
                  <p>{row.player_name}</p>
                  <p>{row.player_class}</p>
                  <p>{row.damage}</p>
                  <p>{row.kills}</p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  const client = getPgClient();
  await client.connect();
  const query = await client.query(
    "select * from stats inner join match on stats.match_id=match.match_id group by match.match_id,stats.match_id,player_name order by timestamp desc"
  );
  await client.end();

  return {
    props: {
      matches: _.groupBy(
        query.rows.map((e) => ({
          ...e,
          timestamp: new Date(e.timestamp).toJSON()
        })),
        "match_id"
      )
    }
  };
};

export default Page;
