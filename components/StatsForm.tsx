import { Button, Select, Input } from "@components/form";
import axios from "axios";
import { useState } from "react";
import { Loading } from "./Icons";

const StatsForm = () => {
  const [matchType, setMatchType] = useState("challenge");
  const [imageUrl, setImageUrl] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleSubmit = async () => {
    setSubmitLoading(true);

    try {
      if (imageUrl === "") return;
      await axios.post("/api/player-stats", {
        imageUrl,
        matchType
      });

      setImageUrl("");
    } catch (error) {
      console.error(error);
    }

    setSubmitLoading(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL"
        value={imageUrl}
      />
      <div className="flex flex-col gap-2">
        <p className="font-semibold">Match Type</p>
        <Select
          onChange={(e) => setMatchType(e.target.value)}
          value={matchType}
        >
          <option defaultChecked>None</option>
          {["challenge", "mercenary", "ava"].map((e) => (
            <option key={e}>{e}</option>
          ))}
        </Select>
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
