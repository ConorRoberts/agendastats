import PlayerStats from "@typedefs/PlayerStats";
import getPgClient from "@utils/getPgClient";
import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;
  const { data, matchType } = body;
  try {
    if (method === "POST") {

      const client = getPgClient();

      await client.connect();
      const matchId = randomUUID();
      await client.query(
        `insert into stats (match_id,player_team,player_name,player_agency,player_class,kills,bot_kills,damage,absorbed,deaths,healing,assists,buffs,obj_pts,defense,timestamp) values ${data
          .map(
            (e:PlayerStats) =>
              `('${matchId}','${e.player_team}','${e.player_name}','${
                e.player_agency
              }','${e.player_class}',${e.kills},${e.bot_kills},${e.damage},${
                e.absorbed
              },${e.deaths},${e.healing},${e.assists},${e.buffs},${e.obj_pts},${
                e.defense
              },'${new Date(e.timestamp).toLocaleDateString()}')`
          )
          .join(",")}`
      );

      await client.query(
        "insert into match(match_id,match_type) values($1,$2)",
        [matchId, matchType]
      );

      await client.end();

      return res.status(200).json(data);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

export default handler;
