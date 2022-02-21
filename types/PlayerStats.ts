import { Timestamp } from "firebase/firestore";

interface PlayerStats {
  name: string;
  agency?: string;
  kills: number;
  absorbed: number;
  healing: number;
  damage: number;
  objPts: number;
  buffs: number;
  defense: number;
  botKills: number;
  deaths: number;
  assists: number;
  timestamp: Date | Timestamp | string;
  gameId?: string;
  class?: "assault" | "medic" | "recon" | "robo";
}

export default PlayerStats;
