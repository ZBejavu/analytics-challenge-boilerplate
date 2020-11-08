import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { weeklyRetentionObject } from "../models";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { getDateInFormat, today } from "./dateHelpers";
import { Loading } from "react-loading-wrapper";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";
import { TableBody } from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";

interface totalRetention {
  percent:number,
  usersInSystem: number,
  weekStart: string,
  weekEnd: string
}

export default function RetentionTable() {
  const [retention, setRetention] = useState<weeklyRetentionObject[]>([]);
  const [totalRetention, setTotalRetention] = useState<totalRetention[]>([]);
  const [offset, setOffset] = useState<number>(new Date().getTime());
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setOffset(new Date(event.target.value).getTime());
  };
  const getRetention = useCallback(
    async (offset) => {
      const { data } = await axios.get(`http://localhost:3001/events/retention?dayZero=${offset}`);
      setRetention(data);
    },
    [offset]
  );
  const getTotalUserRetention = useCallback(
    async (offset) => {
      const { data } = await axios.get(`http://localhost:3001/events/totalUserRetention?dayZero=${offset}`);
      setTotalRetention(data);
    },
    [offset]
  );

  useEffect(() => {
    getRetention(offset);
    getTotalUserRetention(offset);
  }, [offset]);

  return (
    <div className='retentionTile'>
      <div className='divTitle'>user retention cohort</div>
      {retention && (
        <>
          <TextField
            label="dayZero"
            type="date"
            style={{ height: "50px", width: "20%", alignSelf:'flex-end'}}
            InputProps={{
              inputProps: { min: "2020-05-01", max: getDateInFormat(today) },
            }}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TableContainer>
            <Table style={{ border: "1px solid #b3b3b3" }}>
              <TableHead>
                <TableRow style={{ background: "#e2e2e2" }}>
                  <TableCell>Dates</TableCell>
                  {retention[0]?.weeklyRetention.map((percentages: number, i: number) => (
                    <TableCell key={uuidv4()}>Week Number {i}</TableCell>
                  ))}
                </TableRow>
                {
                  totalRetention.length > 0 &&
                <TableRow>
                  <TableCell>
                  <div><b>All Users</b></div>
                  {`${totalRetention[0].weekStart} - ${totalRetention[totalRetention.length - 1].weekEnd}`}<br/>
                  </TableCell>
                  {
                    totalRetention.map((data:totalRetention, index: number) => (
                      <TableCell key={uuidv4()}>
                        <div>
                          <b>{"users: "}</b>{data.usersInSystem}
                        </div>
                        <b>{"Active: " + data.percent + "%"}</b>
                      </TableCell>
                    ))}
                </TableRow>
                }
              </TableHead>
              <TableBody>
                {retention.map((weeklyRetentionData: weeklyRetentionObject) => (
                  <TableRow key={uuidv4()}>
                    <TableCell>
                      {weeklyRetentionData.start} - {weeklyRetentionData.end}
                      <div><b>{weeklyRetentionData.newUsers} new users</b></div>
                    </TableCell>
                    {weeklyRetentionData.weeklyRetention.map((cell: number, index: number) => (
                      <TableCell key={uuidv4()}>
                        {cell === null
                          ? "not available"
                          : weeklyRetentionData.newUsers === 0
                          ? "no users signed up"
                          : cell + "%"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
}

const P = styled.p`
  padding: 0;
  margin: 0;
  font-size: 10px;
  color: grey;
`;
const Cell = styled.div`
  padding: 0;
  margin: 0;
  font-size: 10px;
  color: grey;
`;
