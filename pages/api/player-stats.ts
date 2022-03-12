import PlayerStats from "@typedefs/PlayerStats";
import getPgClient from "@utils/getPgClient";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;
  const { matchType, imageUrl } = body;
  try {
    if (method === "POST") {
      const client = getPgClient();

      const { data } = await axios.post(
        "https://ocr-gplqjog2wq-uc.a.run.app/",
        { image_url: imageUrl }
      );

      console.log(data);

      const matchId = data[0].match_id;

      await client.connect();

      await client.query(
        `insert into stats (match_id,player_team,player_name,player_class,kills,bot_kills,damage,absorbed,deaths,healing,assists,buffs,obj_pts,defense,timestamp) values ${data
          .map(
            (e: PlayerStats) =>
              `('${e.match_id}','${e.player_team}','${e.player_name}','${
                e.player_class
              }',${e.kills},${e.bot_kills},${e.damage ?? (e as any).Omg},${e.absorbed},${
                e.deaths
              },${e.healing},${e.assists},${e.buffs},${e.obj_pts},${
                e.defense
              },'${new Date().toLocaleDateString()}')`
          )
          .join(",")};`
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
