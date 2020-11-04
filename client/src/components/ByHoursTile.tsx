import React, { useState, useEffect, useCallback } from "react";
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
import {Resizable} from 're-resizable'
import TextField from "@material-ui/core/TextField";
import { getDateInFormat, getOffsetFromString, today } from "./dateHelpers";

interface HourSessions {
  hour: string;
  count: number;
}

const SessionsByHours = () => {
  const [sessions, setSessions] = useState<HourSessions[] | undefined>(undefined);
  const [offset, setOffset] = useState<number>(0);
  const getSessions = useCallback(async () => {
    let { data } = await axios.get(`http://localhost:3001/events/by-hours/${offset}`);
    setSessions(data);
  }, [offset]);

  useEffect(() => {
    getSessions();
  }, [offset]);

  return (
    <div className='daytile'>
        <TextField
          label="dateStart"
          type="date"
          style={{ height: "50px", width: "20%", alignSelf:'flex-end' }}
          InputProps={{
            inputProps: { min: "2020-05-01", max: getDateInFormat(today) },
          }}
          onChange={(e) => setOffset(getOffsetFromString(e.target.value))}
          InputLabelProps={{
            shrink: true,
          }}
        />
          <ResponsiveContainer>
            <LineChart height={10} data={sessions}>
              <Line type="monotone" dataKey="count" stroke="#8884d8" name="This Day" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
      </div>
  );
};

export default SessionsByHours;
