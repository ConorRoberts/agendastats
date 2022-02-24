import { Input } from "@components/form";
import PlayerStats from "@typedefs/PlayerStats";
import getPgClient from "@utils/getPgClient";
import Link from "next/link";
import { useState } from "react";

const Page = ({ players }: { players: string[] }) => {
  const [playerQuery, setPlayerQuery] = useState("");

  const filteredPlayers = players.filter((e: string) =>
    e.toLowerCase().includes(playerQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col gap-4 bg-white rounded-xl shadow-md mx-auto max-w-2xl p-2 sm:p-4">
        <h2 className="text-center">Player Search</h2>
        <Input
          placeholder="Search"
          value={playerQuery}
          onChange={(e) => setPlayerQuery(e.target.value)}
        />
        <div className="flex-col rounded-xl border border-gray-200 divide-y bg-white overflow-hidden">
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((player: string) => (
              <Link key={player} href={`/player/${player}`}>
                <div
                  className={`py-1 px-4 background-hover capitalize`}
                >
                  {player}
                </div>
              </Link>
            ))
          ) : (
            <div className="py-1 px-4 capitalize">No players found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  const client = getPgClient();
  await client.connect();
  const players = await client.query(
    "select distinct player_name from stats order by player_name"
  );

  await client.end();

  return {
    props: {
      players: players.rows.map((e: PlayerStats) => e.player_name)
    }
  };
};

export default Page;
