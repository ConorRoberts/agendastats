import { Assault, Medic, Recon, Robotics } from "@components/Icons";
import getPgClient from "@utils/getPgClient";
import { NextPageContext } from "next";
import { useRouter } from "next/router";

const icons = {
  robo: <Robotics className="w-5 h-5" />,
  assault: <Assault className="w-5 h-5" />,
  medic: <Medic className="w-5 h-5" />,
  recon: <Recon className="w-5 h-5" />
};

const Page = ({ averages, records, globalAverages }) => {
  const router = useRouter();
  const { name } = router.query;

  return (
    <div>
      <div className="bg-white rounded-xl p-3 shadow-md mx-auto w-full max-w-3xl flex flex-col gap-4">
        <h2>{name}</h2>

        <h3>Top Stats</h3>
        <div className="flex gap-4 capitalize">
          {Object.entries(records as object)
            .filter(([_stat, { value }]) => value > 0)
            .map(([label, { player_class, value }]) => (
              <div key={label} className="flex-1">
                <h4>{label}</h4>
                <div className="capitalize rounded-xl p-2 border border-gray-200">
                  <p>{player_class}</p>
                  <p>{value}</p>
                </div>
              </div>
            ))}
        </div>
        <h3>Averages</h3>
        <div className="flex gap-4 capitalize flex-col">
          {Object.entries(averages).map(([label, data]) => (
            <div key={label} className="flex-1 flex flex-col gap-4">
              <div className="flex gap-4 items-center">
                {icons[label]}
                <h5>{label}</h5>
              </div>
              <div className="flex flex-row gap-4">
                {Object.entries(data)
                  .filter(([_stat, { value }]) => value > 0)
                  .map(([stat, { value }]) => (
                    <div
                      key={"avg" + label + stat}
                      className="capitalize rounded-xl p-2 border border-gray-200 flex-1"
                    >
                      <p>{stat}</p>
                      <p>{Math.round(value).toLocaleString("en")}</p>
                      <p>
                        {(
                          (value / globalAverages[label][stat]) * 100 -
                          100
                        ).toFixed(2)}
                        %{" "}
                        {(value / globalAverages[label][stat]) * 100 - 100 > 0
                          ? "higher"
                          : "lower"}{" "}
                        than average
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
  const {
    query: { name }
  } = context;

  const client = getPgClient();
  await client.connect();

  const playerData = await client.query(
    "select * from stats where player_name = $1",
    [name]
  );

  const averages = {};
  const records = {};
  const globalAverages = {
    assault: {},
    medic: {},
    recon: {},
    robo: {}
  };

  const averageDamage = await client.query(
    "select player_name,player_class,avg(damage) as value from stats where player_name = $1 group by player_name,player_class order by avg(damage) desc",
    [name]
  );

  averageDamage.rows.forEach((row) => {
    if (!averages[row.player_class]) averages[row.player_class] = {};
    averages[row.player_class]["damage"] = row;
  });

  const averageHealing = await client.query(
    "select player_name,player_class,avg(healing) as value from stats where player_name = $1 group by player_name,player_class order by avg(healing) desc",
    [name]
  );
  averageHealing.rows.forEach((row) => {
    if (!averages[row.player_class]) averages[row.player_class] = {};
    averages[row.player_class]["healing"] = row;
  });
  const playerAverageKills = await client.query(
    "select player_name,player_class,avg(kills) as value from stats where player_name = $1 group by player_name,player_class order by avg(kills) desc",
    [name]
  );
  playerAverageKills.rows.forEach((row) => {
    if (!averages[row.player_class]) averages[row.player_class] = {};
    averages[row.player_class]["kills"] = row;
  });

  Object.keys(globalAverages).forEach((e) => {
    ["kills", "damage", "healing"].forEach(async (stat) => {
      const globalAvg = await client.query(
        `select player_class,avg(${stat}) as value from stats where player_class = '${e}' group by player_class`
      );
      globalAverages[e][stat] = globalAvg.rows[0].value;
    });
  });

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

  records["kills"] = maxKills.rows.at(0);
  records["damage"] = maxDamage.rows.at(0);
  records["healing"] = maxHealing.rows.at(0);

  await client.end();
  return {
    props: {
      data: playerData.rows.map((e) => ({
        ...e,
        timestamp: new Date(e.timestamp).toJSON()
      })),
      averages,
      records,
      globalAverages
    }
  };
};

export default Page;
