import { Input } from "@components/form";
import { Assault, Medic, Recon, Robotics } from "@components/Icons";
import PlayerStats from "@typedefs/PlayerStats";
import getPgClient from "@utils/getPgClient";
import Link from "next/link";
import { useEffect, useState } from "react";

const headers = [
  "Date",
  "Class",
  "Name",
  "Kills",
  "Dmg",
  "Heal",
  "Assists",
  "Deaths",
  "Bot Kills"
];

const icons = {
  robo: <Robotics className="w-6 h-6" />,
  assault: <Assault className="w-6 h-6" />,
  medic: <Medic className="w-6 h-6" />,
  recon: <Recon className="w-6 h-6" />
};

const Page = ({ averages, singleMatchRecords, players }) => {
  const [playerQuery, setPlayerQuery] = useState("");
  return (
    <div className="flex flex-col gap-8 p-2 mx-auto max-w-5xl">
      <div className="flex flex-col gap-4">
        <h2 className="text-center">Top Stats</h2>
        <div className="flex gap-4 flex-col">
          {averages.map(([label, data]) => (
            <div key={label} className="flex flex-col gap-4">
              <h4>{label}</h4>
              <div className="grid gap-4 grid-cols-3">
                {data.map(({ player_name, player_class, value }) => (
                  <div
                    key={label + player_name}
                    className="capitalize rounded-md p-2 border border-gray-300 grid grid-cols-2"
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
          {singleMatchRecords.map(([label, data]) => (
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
          ))}
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
                  className={`py-1 px-4 background-hover ${
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
    "select player_name,player_class,avg(damage) as value from stats group by player_name,player_class order by avg(damage) desc limit 3"
  );
  const highestAverageKills = await client.query(
    "select player_name,player_class,avg(kills) as value from stats group by player_name,player_class order by avg(kills) desc limit 3"
  );
  const highestAverageHealing = await client.query(
    "select player_name,player_class,avg(healing) as value from stats group by player_name,player_class order by avg(healing) desc limit 3"
  );
  const singleMatchHealing = await client.query(
    "select player_name,player_class,max(healing) as value from stats group by match_id,player_name,player_class order by avg(healing) desc limit 3"
  );
  const players = await client.query(
    "select distinct player_name from stats order by player_name"
  );
  await client.end();

  return {
    props: {
      players: players.rows.map((e) => e.player_name),
      averages: [
        [
          "Average Damage",
          highestAverageDmg.rows.map((e) => ({
            ...e,
            timestamp: new Date(e.timestamp).toJSON()
          }))
        ],
        [
          "Average Kills",
          highestAverageKills.rows.map((e) => ({
            ...e,
            timestamp: new Date(e.timestamp).toJSON()
          }))
        ],
        [
          "Average Healing",
          highestAverageHealing.rows.map((e) => ({
            ...e,
            timestamp: new Date(e.timestamp).toJSON()
          }))
        ]
      ],
      singleMatchRecords: [
        [
          "Single Match Healing",
          singleMatchHealing.rows.map((e) => ({
            ...e,
            timestamp: new Date(e.timestamp).toJSON()
          }))
        ]
      ]
    }
  };
};

export default Page;
