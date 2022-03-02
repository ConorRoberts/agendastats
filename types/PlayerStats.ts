interface PlayerStats {
  player_name: string;
  player_agency: string;
  player_class: "assault" | "medic" | "recon" | "robo";
  kills: number;
  absorbed: number;
  healing: number;
  damage: number;
  obj_pts: number;
  buffs: number;
  defense: number;
  bot_kills: number;
  deaths: number;
  assists: number;
  timestamp: string;
  match_id: string;
  player_team: "blue" | "red";
}

export default PlayerStats;
