import React, { useCallback, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import { getDateInFormat, FromStringToDayOffset, today } from "./dateHelpers";
interface daySessions {
  date: string;
  count: number;
}

const SessionsByDay = () => {
  const [offset, setOffset] = useState<number>(5);
  const [byDays, setByDays] = useState<daySessions[] | undefined>(undefined);
  const getData = useCallback(async () => {
    const { data } = await axios.get(`http://localhost:3001/events/by-days/${offset}`);
    setByDays(data);
  }, [offset]);

  useEffect(() => {
    getData();
  }, [offset]);

  return (
        <div style={{ height: "40vh", width: "40vw", display:'flex', flexDirection:'column' }}>
        <TextField
          label="dateStart"
          type="date"
          style={{ height: "50px", width: "20%", alignSelf:'flex-end'}}
          InputProps={{
            inputProps: { min: "2020-06-01", max: getDateInFormat(today) },
          }}
          onChange={(e) => setOffset(FromStringToDayOffset(e.target.value))}
          InputLabelProps={{
            shrink: true,
          }}
        />
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={byDays}>
              <Line type="monotone" dataKey="count" stroke="#8884d8" name="This Week" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
  );
};

export default SessionsByDay;
