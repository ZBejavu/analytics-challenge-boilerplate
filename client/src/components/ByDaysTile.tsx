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
import { getDateInFormat, getOffsetFromString, today } from "./dateHelpers";
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
      <div className='weektile'>
      <div className='divTitle'>sessions by days</div>
        <TextField
          label="dateStart"
          type="date"
          style={{ height: "50px", width: "20%", alignSelf:'flex-end'}}
          InputProps={{
            inputProps: { min: "2020-06-01", max: getDateInFormat(today) },
          }}
          onChange={(e) => setOffset(getOffsetFromString(e.target.value))}
          InputLabelProps={{
            shrink: true,
          }}
        />
          <ResponsiveContainer>
            <LineChart height={10} data={byDays}>
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
