import { Button, TextArea, Select } from "@components/form";
import axios from "axios";
import { FormEvent, useState } from "react";
import { Minus, Plus } from "./Icons";

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      await axios.post("/api/player-stats", {
        classCounts: Object.entries(counts),
        text
      });
    } catch (error) {
      console.error(error);
    }

    setSubmitLoading(false);
    setText("");
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

  return (
    <form onSubmit={handleSubmit}>
      <TextArea
        onChange={(e) => setText(e.target.value)}
        placeholder="Stats"
        value={text}
      />
      <Select onChange={(e) => setMatchType(e.target.value)} value={matchType}>
        {["challenge", "mercenary", "ava"].map((e) => (
          <option key={e}>{e}</option>
        ))}
      </Select>
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
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default StatsForm;
