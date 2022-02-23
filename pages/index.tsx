import { Input } from "@components/form";
import { Assault, Medic, Recon, Robotics } from "@components/Icons";
import getPgClient from "@utils/getPgClient";
import Link from "next/link";
import { useState } from "react";

const icons = {
  robo: <Robotics className="w-6 h-6" />,
  assault: <Assault className="w-6 h-6" />,
  medic: <Medic className="w-6 h-6" />,
  recon: <Recon className="w-6 h-6" />
};

const Page = ({ averages, players, topPlayers }) => {
  const [playerQuery, setPlayerQuery] = useState("");
  return (
    <div className="flex flex-col gap-8 p-2 mx-auto max-w-5xl w-full">
      <div className="flex flex-col gap-4">
        <h2>Leaderboard</h2>
        <div>
          {topPlayers.map((player, index) => (
            <div
              key={`${player.rank} ${index}`}
              className="gap-4 items-center grid grid-cols-3"
            >
              <p>{parseFloat(player.rank).toFixed(2)}</p>
              <p className="capitalize">{player.player_name}</p>
              <p className="capitalize">{player.player_class}</p>
            </div>
          ))}
        </div>
        <h2 className="text-center">Top Stats</h2>
        <div className="flex gap-4 flex-col">
          {averages.map(([label, data]) => (
            <div key={label} className="flex flex-col gap-4">
              <h4>{label}</h4>
              <div className="grid gap-4 sm:grid-cols-3">
                {data.map(({ player_name, player_class, value }) => (
                  <div
                    key={label + player_name}
                    className="capitalize rounded-md p-2 border border-gray-300 grid grid-cols-2 bg-white"
                  >
                    <div className="flex gap-4 items-center">
                      {icons[player_class]}
                      <p>{player_name}</p>
                    </div>
                    <p className="text-center my-auto">
                      {Math.round(value).toLocaleString("en")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* {singleMatchRecords.map(([label, data]) => (
            <div key={label} className="flex flex-col gap-4">
              <h4>{label}</h4>
              <div className="grid gap-4 grid-cols-3">
                {data.map(({ player_name, player_class, value }) => (
                  <div
                    key={label + player_name}
                    className="rounded-md p-2 border border-gray-300 capitalize grid grid-cols-2"
                  >
                    <div className="flex gap-4 items-center">
                      {icons[player_class]}
                      <p>{player_name}</p>
                    </div>
                    <p className="text-center my-auto">
                      {Math.round(value).toLocaleString("en")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))} */}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-center">Players</h2>
        <Input
          placeholder="Search"
          value={playerQuery}
          onChange={(e) => setPlayerQuery(e.target.value)}
        />
        <div className="flex-col rounded-xl border border-gray-200 divide-y bg-white">
          {players
            .filter((e: string) =>
              e.toLowerCase().includes(playerQuery.toLowerCase())
            )
            .map((player: string) => (
              <Link key={player} href={`/player/${player}`}>
                <div
                  className={`py-1 px-4 background-hover capitalize ${
                    player.length > 8 && "col-span-2"
                  }`}
                >
                  {player}
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  const client = getPgClient();
  await client.connect();
  const highestAverageDmg = await client.query(
    "select A.player_name,A.player_class,A.damage as value from (select player_name,player_class,avg(damage) as damage,count(*) from stats group by player_name,player_class having count(*)>3) as A order by damage desc limit 3;"
  );
  const highestAverageKills = await client.query(
    "select A.player_name,A.player_class,A.kills as value from (select player_name,player_class,avg(kills) as kills,count(*) from stats group by player_name,player_class having count(*)>3) as A order by kills desc limit 3;"
  );
  const highestAverageHealing = await client.query(
    "select A.player_name,A.player_class,A.healing as value from (select player_name,player_class,avg(healing) as healing,count(*) from stats group by player_name,player_class having count(*)>3) as A order by healing desc limit 3;"
  );
  const singleMatchHealing = await client.query(
    "select player_name,player_class,max(healing) as value from stats group by match_id,player_name,player_class order by avg(healing) desc limit 3"
  );
  const players = await client.query(
    "select distinct player_name from stats order by player_name"
  );

  const topPlayers =
    await client.query(`SELECT A.player_name,A.player_class,(100-AVG((KILLS+DAMAGE+bot_kills+ABSORBED+HEALING+ASSISTS+BUFFS+obj_pts+DEFENSE)/7.5)) as rank FROM (select player_name,player_class,rank() OVER (PARTITION BY player_CLASS order by sum(KILLS) DESC) KILLS,
      rank() OVER (PARTITION BY player_CLASS order by sum(DAMAGE) DESC) DAMAGE,rank() OVER (PARTITION BY player_CLASS order by sum(bot_kills) DESC) bot_kills,rank() OVER (PARTITION BY player_CLASS order by sum(absorbed) DESC) ABSORBED,rank() OVER (PARTITION BY player_CLASS order by sum(healing) DESC) HEALING,rank() OVER (PARTITION BY player_CLASS order by sum(assists) DESC) ASSISTS,rank() OVER (PARTITION BY player_CLASS order by sum(buffs) DESC) BUFFS,rank() OVER (PARTITION BY player_CLASS order by sum(obj_pts) DESC) obj_pts, rank() OVER (PARTITION BY player_CLASS order by sum(defense) DESC) DEFENSE from stats group by PLAYER_NAME, PLAYER_CLASS )A group by A.PLAYER_NAME, A.PLAYER_CLASS order by rank desc limit 10`);

  await client.end();

  return {
    props: {
      players: players.rows.map((e) => e.player_name),
      averages: [
        [
          "Average Damage",
          highestAverageDmg.rows
        ],
        [
          "Average Kills",
          highestAverageKills.rows
        ],
        [
          "Average Healing",
          highestAverageHealing.rows
        ]
      ],
      singleMatchRecords: [
        [
          "Single Match Healing",
          singleMatchHealing.rows
        ]
      ],
      topPlayers: topPlayers.rows
    }
  };
};

export default Page;
