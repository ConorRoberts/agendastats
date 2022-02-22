import { Button, TextArea, Select } from "@components/form";
import getPlayerStatsFromText from "@utils/getPlayerStatsFromText";
import axios from "axios";
import { useEffect, useState } from "react";
import { Loading, Minus, Plus } from "./Icons";

const StatsForm = () => {
  const [text, setText] = useState("");
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    assault: 0,
    medic: 0,
    recon: 0,
    robo: 0
  });
  const [matchType, setMatchType] = useState("challenge");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [parsedData, setParsedData] = useState([]);

  const handleSubmit = async () => {
    setSubmitLoading(true);

    try {
      await axios.post("/api/player-stats", {
        classCounts: Object.entries(counts),
        text,
        matchType
      });
      setText("");
    } catch (error) {
      console.error(error);
    }

    setSubmitLoading(false);
  };

  const handleCountChange = (label: string, value: number) => {
    let adjustedValue = value;
    if (value < 0) {
      adjustedValue = 0;
    } else if (value > 10) {
      adjustedValue = 10;
    }

    setCounts({ ...counts, [label]: adjustedValue });
  };

  useEffect(() => {
    try {
      const data = getPlayerStatsFromText(text, Object.entries(counts));

      setParsedData(data);
    } catch (error) {
      console.error(error);
    }
  }, [text, counts]);

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 text-center font-semibold">
        <p>Preview</p>
        <p>Data</p>
      </div>
      <div className="grid grid-cols-2 h-[800px] overflow-y-auto gap-4">
        <TextArea
          onChange={(e) => setText(e.target.value)}
          placeholder="Stats"
          value={text}
        />
        <pre className="overflow-hidden overflow-y-auto border border-gray-300 rounded-md">
          {JSON.stringify(parsedData, null, 4)}
        </pre>
      </div>
      <div className="flex flex-col gap-8 mx-auto w-full max-w-lg">
        <div className="flex flex-col gap-2">
          <p className="font-semibold">Match Type</p>
          <Select
            onChange={(e) => setMatchType(e.target.value)}
            value={matchType}
          >
            {["challenge", "mercenary", "ava"].map((e) => (
              <option key={e}>{e}</option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-semibold">Class Distribution</p>
          <div className="flex flex-col gap-2">
            {Object.entries(counts).map(([label, value]) => (
              <div key={label} className="grid grid-cols-2 my-2">
                <p className="capitalize">{label}</p>
                <div className="grid grid-cols-3 gap-4">
                  <Minus
                    onClick={() => handleCountChange(label, value - 1)}
                    className="w-6 h-6 primary-hover"
                  />
                  <p className="text-lg font-regular">{value}</p>
                  <Plus
                    onClick={() => handleCountChange(label, value + 1)}
                    className="w-6 h-6 primary-hover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-4">
        <Button type="submit" onClick={handleSubmit}>
          Submit
        </Button>
        {submitLoading && (
          <Loading className="w-5 h-5 text-gray-500 animate-spin" />
        )}
      </div>
    </div>
  );
};

export default StatsForm;
