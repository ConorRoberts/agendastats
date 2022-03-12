import { Assault, Medic, Recon, Robotics } from "@components/Icons";
import PlayerStats from "@typedefs/PlayerStats";
import getPgClient from "@utils/getPgClient";
import { NextPageContext } from "next";

const icons = {
  robo: <Robotics className="w-5 h-5" />,
  assault: <Assault className="w-5 h-5" />,
  medic: <Medic className="w-5 h-5" />,
  recon: <Recon className="w-5 h-5" />
};

interface PageProps {
  name: string;
  records: PlayerStats[];
  gamesPlayed: { [className: string]: number };
  playerAvg: object[];
}

const Page = ({ records, name, gamesPlayed, playerAvg }: PageProps) => {
  return (
    <div>
      <div className="bg-white rounded-xl p-3 shadow-md mx-auto w-full max-w-4xl flex flex-col gap-4">
        <div className="mx-auto text-center">
          <h2 className="capitalize">{name}</h2>
          <p>
            {Object.values(gamesPlayed).reduce(
              (a: number, b: number) => a + b,
              0
            )}{" "}
            game(s) played
          </p>
        </div>

        <h3>Top Stats</h3>
        <div className="flex gap-4 sm:flex-row flex-col">
          {Object.entries(records as object)
            .filter(([_stat, { value }]) => value > 0)
            .map(([label, { player_class, value }]) => (
              <div key={label} className="flex-1">
                <h4 className="capitalize">{label}</h4>
                <div className="rounded-xl p-2 border border-gray-200 grid grid-cols-2">
                  <p className="capitalize">{player_class}</p>
                  <p>{value}</p>
                </div>
              </div>
            ))}
        </div>
        <h3>Averages</h3>
        <div className="flex gap-4 flex-col">
          {playerAvg.map((data: PlayerStats) => (
            <div
              key={data.player_class + "average"}
              className="flex-1 flex flex-col gap-4"
            >
              <div className="flex gap-4 flex-row items-center">
                {icons[data.player_class]}
                <h5 className="capitalize">{data.player_class}</h5>
                <p>{gamesPlayed[data.player_class]} game(s)</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(data)
                  .filter(
                    (entry) =>
                      parseInt(entry[1]) > 0 &&
                      entry[0] !== "player_class" &&
                      !entry[0].startsWith("global")
                  )
                  .map(([stat, value]) => (
                    <div
                      key={"avg" + data.player_class + stat}
                      className="capitalize rounded-xl p-2 border border-gray-200 flex-1 grid grid-cols-3"
                    >
                      <p>{stat}</p>
                      <p>{Math.round(value).toLocaleString("en")}</p>
                      <p
                        className={`text-white mx-auto w-max rounded-full px-2 sm:px-4 ${
                          (value / data[`global_${stat}`]) * 100 - 100 > 0
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {(value / data[`global_${stat}`]) * 100 - 100 > 0 &&
                          "+"}
                        {((value / data[`global_${stat}`]) * 100 - 100).toFixed(
                          2
                        )}
                        %
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const { query } = context;

  const name = (query.name as string).toLowerCase().replace(/[^0-9a-z_]/g, "");
  const classes = ["assault", "medic", "recon", "robo"];

  const client = getPgClient();
  await client.connect();

  const records = {};
  const globalAvg = await client.query(
    `select player_class,avg(kills) as global_kills,avg(healing) as global_healing,avg(deaths) as global_deaths,avg(damage) as global_damage, avg(defense) as global_defense, avg(assists) as global_assists from stats group by player_class`
  );
  const playerAvg = await client.query(
    `select player_class,avg(kills) as kills,avg(healing) as healing,avg(deaths) as deaths,avg(damage) as damage, avg(defense) as defense, avg(assists) as assists from stats where player_name=$1 group by player_class`,
    [name]
  );

  const maxKills = await client.query(
    "select player_name,player_class,max(kills) as value from stats where player_name = $1 group by player_name,player_class order by max(kills) desc limit 1",
    [name]
  );
  const maxHealing = await client.query(
    "select player_name,player_class,max(healing) as value from stats where player_name = $1 group by player_name,player_class order by max(healing) desc limit 1",
    [name]
  );
  const maxDamage = await client.query(
    "select player_name,player_class,max(damage) as value from stats where player_name = $1 group by player_name,player_class order by max(damage) desc limit 1",
    [name]
  );

  const matchesPlayed = await client.query(
    `${classes
      .map(
        (className) =>
          `
          select count(*) as value from stats where player_name = $1 and player_class='${className}'
        `
      )
      .join(" union all ")}`,
    [name]
  );

  // const matchHistory = await client.query(
  //   "select timestamp,player_name,player_class from stats where player_name = $1 order by timestamp desc",
  //   [name]
  // );

  records["kills"] = maxKills.rows.at(0);
  records["damage"] = maxDamage.rows.at(0);
  records["healing"] = maxHealing.rows.at(0);

  await client.end();
  return {
    props: {
      records,
      gamesPlayed: Object.fromEntries(
        matchesPlayed.rows.map((e, index) => [
          classes[index],
          parseInt(e.value)
        ])
      ),
      name,
      playerAvg: playerAvg.rows.map((e: PlayerStats) => ({
        ...e,
        ...globalAvg.rows.find(
          (global: PlayerStats) => global.player_class === e.player_class
        )
      }))
    }
  };
};

export default Page;
