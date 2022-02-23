import PlayerStats from "./PlayerStats";

interface JoinedMatchStats extends PlayerStats{
    match_type: "challenge" | "mercenary" | "ava";
}

export default JoinedMatchStats;