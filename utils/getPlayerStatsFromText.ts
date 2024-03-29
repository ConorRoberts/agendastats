import PlayerStats from "@typedefs/PlayerStats";

export type ClassCounts = [string, number][];

const getPlayerStatsFromText = (
  str: string,
  classes: ClassCounts
): PlayerStats[] => {
  try {
    const text = str
      .split("\n")
      .filter((line) => line.length >= 1)
      .map((e) => e.replace("\r", "").trim());

    let col = 0,
      classCount = 0,
      classIdx = 0;
    let data = `${text.slice(0, 12).join(",")},Class\n`;
    const result: PlayerStats[] = [];
    let current: (string | number)[] = [];

    text.slice(12).forEach((line) => {
      if (col < 2) {
        // Check for missing agency
        if (col === 1 && !isNaN(parseInt(line))) {
          // console.log(parseInt(line));
          current.push("");
          col++;
          current.push(parseInt(line));
        } else {
          current.push(line.replace(/[0-9+]+ | +|\W/g, "").toLowerCase());
        }
        col++;
      } else {
        if (/[0-9]+ +[0-9]+/g.test(line)) {
          line.split(" ").forEach((e) => {
            col++;
            current.push(parseInt(e));
          });
        } else {
          current.push(parseInt(line));
          col++;
        }
      }

      if (col === 12) {
        if (classIdx>=(classes.length)){
          return;
        }
        
        const [name, num] = classes[classIdx];

        if (classCount < num * 2) {
          current.push(name);
        }

        classCount++;

        if (classCount === num) {
          classCount = 0;
          classIdx++;
        }
        const obj = {
          ...Object.fromEntries(
            current.map((e, i) => [i === 12 ? "Class" : text[i], e])
          ),
          timestamp: new Date().toLocaleDateString()
        } as PlayerStats;

        result.push(obj);
        data = data + `${current.join(",")}\n`;
        current = [];
        col = 0;
      }
    });

    return result.map((e) => fixKeys(e));
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const fixKeys = (obj: object): PlayerStats => {
  const translate = {
    "Class/Level/Name": "player_name",
    Agency: "player_agency",
    Kills: "kills",
    Absorbed: "absorbed",
    Heal: "healing",
    Dmg: "damage",
    Deaths: "deaths",
    "Obj. Pts": "obj_pts",
    Assists: "assists",
    Buffs: "buffs",
    Defense: "defense",
    "Bot Kills": "bot_kills",
    Class: "player_class"
  };

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (key === "timestamp") return [key, value];
      return [translate[key], value];
    })
  );
};
export default getPlayerStatsFromText;
