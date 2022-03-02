import { Button, TextArea, Select } from "@components/form";
import PlayerStats from "@typedefs/PlayerStats";
import axios from "axios";
import { useState } from "react";
import { Loading } from "./Icons";

const StatsForm = () => {
  const [text, setText] = useState("");

  const [matchType, setMatchType] = useState("challenge");
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleSubmit = async () => {
    setSubmitLoading(true);

    try {
      await axios.post("/api/player-stats", {
        data: JSON.parse(text).map((e:PlayerStats) => ({
          ...e,
          timestamp: new Date().toLocaleDateString()
        })),
        matchType
      });
      setText("");
    } catch (error) {
      console.error(error);
    }

    setSubmitLoading(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="h-[800px] overflow-y-auto gap-4">
        <TextArea
          onChange={(e) => setText(e.target.value)}
          placeholder="Stats"
          value={text}
        />
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
