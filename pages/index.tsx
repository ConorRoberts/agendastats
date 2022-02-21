import PlayerStats from "@typedefs/PlayerStats";
import {
  collection,
  getDocs,
  getFirestore,
  Timestamp
} from "firebase/firestore";
import _ from "lodash";

const headers = [
  "Class",
  "Name",
  "Kills",
  "Dmg",
  "Heal",
  "Assists",
  "Deaths",
  "Obj. Pts",
  "Defense",
  "Absorbed",
  "Buffs",
  "Bot Kills"
];

const Page = ({ stats }) => {
  return (
    <div className="flex flex-col gap-2 p-2">
      <div className=" rounded-md grid grid-cols-12">
        {headers.map((e) => (
          <p key={e} className="font-semibold">
            {e}
          </p>
        ))}
      </div>
      {stats.map((e: PlayerStats) => (
        <div
          key={e.gameId + e.name}
          className=" rounded-md grid grid-cols-12 capitalize"
        >
          <p>{e.class}</p>
          <p>{e.name}</p>
          <p>{e.kills}</p>
          <p>{e.damage}</p>
          <p>{e.healing}</p>
          <p>{e.assists}</p>
          <p>{e.deaths}</p>
          <p>{e.objPts}</p>
          <p>{e.defense}</p>
          <p>{e.absorbed}</p>
          <p>{e.buffs}</p>
          <p>{e.botKills}</p>
        </div>
      ))}
    </div>
  );
};

export const getServerSideProps = async () => {
  const db = getFirestore();

  const docs = await getDocs(collection(db, "gameStats"));
  const stats: PlayerStats[] = [];

  docs.forEach((doc) => {
    const data = doc.data() as PlayerStats;
    stats.push({
      ...data,
      timestamp: (data.timestamp as Timestamp).toDate().toLocaleDateString()
    });
  });

  const groupedData = _.groupBy(stats, "name");
  const avgStats = [
    "damage",
    "healing",
    "absorbed",
    "kills",
    "deaths",
    "defense",
    "assists",
    "objPts",
    "buffs",
    "botKills"
  ];

  return {
    props: {
      stats: Object.values(groupedData).map((e) => ({
        ...e[0],
        ...Object.fromEntries(
          avgStats.map((stat) => [stat, _.meanBy(e, (e) => e[stat]).toFixed(2)])
        )
      }))
    }
  };
};

export default Page;
