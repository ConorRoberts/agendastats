import getPlayerStatsFromText from "@utils/getPlayerStatsFromText";
import { randomUUID } from "crypto";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;
  const { text, classCounts } = body;

  if (method === "POST") {
    const db = getFirestore();
    const data = getPlayerStatsFromText(text, classCounts);

    const gameId = randomUUID();

    for (const e of data) {
      await addDoc(collection(db, "gameStats"), { ...e, gameId });
    }

    await addDoc(collection(db, "statsSources"), { gameId, text });
    return res.status(200).json(data);
  }
};

export default handler;
