import React, { useEffect, useState } from "react";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Legend, Cell } from "recharts";
import styled from "styled-components";
import axios from "axios";
import { Loading } from "react-loading-wrapper";
import { Event } from "../models/event";
interface OperatingSystem {
  os: string;
  count: number;
  color: string;
}
const COLORS = ["#b60000", "red", "orange", "#516ce4", "blue", "darkblue"];
const ChartByOs = () => {
  const [osEvents, setOsEvents] = useState<OperatingSystem[] | undefined>(undefined);
  const [osEventsWeek, setOsEventsWeek] = useState<OperatingSystem[] | undefined>(undefined);
  const [osEventsToday, setOsEventsToday] = useState<OperatingSystem[] | undefined>(undefined);
  const getFilteredOsEvents = async (filter:string) => {
    try {
      const { data } = await axios.get(`http://localhost:3001/events/chart/os/${filter}`);
      const allEvents: Event[] = data;
      if (allEvents) {
        const osArray: OperatingSystem[] = Array.from(new Set(allEvents.map((event: Event) => event.os))).map(
          (os, index:number) => {
            return {
              os,
              count: 0,
              color: COLORS[index]
            };
          }
        );
        osArray.forEach((os) => {
            os.count += allEvents.filter((event: Event) => os.os === event.os).length;
          });
        const osToSet = osArray.map((operatingSystem: OperatingSystem) => {
            const percentage = Math.round((operatingSystem.count * 100) / allEvents.length)
            return { os: operatingSystem.os, count: percentage , color:operatingSystem.color};
          })
          if(filter === 'all'){
              setOsEvents(osToSet);
          }else if(filter === 'week'){
              setOsEventsWeek(osToSet);
          }else if(filter === 'today'){
              setOsEventsToday(osToSet);
          }
      }
    } catch (e) {
        console.log(e)
    }
  };
  useEffect(() => {
    getFilteredOsEvents('all');
    getFilteredOsEvents('today');
    getFilteredOsEvents('week');
  }, []);

  return (
    <div className='osTile'>
      <div className='divTitle'>Operating System Percentage</div>
        <Loading loading={!osEvents || !osEventsToday || !osEventsWeek}>
        <div style={{display:'flex', width: '100%'}}>
          {osEvents && osEvents.length>0 &&<div style={{width:'33%'}}>time: All</div>}
          {osEventsWeek&& osEventsWeek.length > 0 &&<div style={{width:'33%'}}>time: Week</div>}
          {osEventsToday && osEventsToday.length > 0&&<div style={{width:'33%'}}>time: Today</div>}
        </div>
        
        <div className='osChartContainer'>
          <ResponsiveContainer width="40%" height="100%">
            <PieChart>
              <Pie
                data={osEvents}
                dataKey="count"
                nameKey="os"
                cx="50%"
                cy="50%"
                outerRadius='60%'
                label
                fill="#8884d8"
              >

                {osEvents?.map((os, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend
                height={10}
                verticalAlign="bottom"
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          {osEventsToday?.length === 0? <div className='divTitle'>No Events Today</div>:
            <ResponsiveContainer width="33%" height="100%">
              <PieChart>
                <Pie
                  data={osEventsToday}
                  dataKey="count"
                  nameKey="os"
                  cx="50%"
                  cy="50%"
                  outerRadius={50}
                  label
                  fill="#8884d8"
                >
                  {osEventsToday?.map((os, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          }
          {osEventsToday?.length === 0? <div className='divTitle'>No Events this Week</div>:
          <ResponsiveContainer width="33%" height="100%">
            <PieChart>
              <Pie
                data={osEventsWeek}
                dataKey="count"
                nameKey="os"
                cx="50%"
                cy="50%"
                outerRadius={50}
                label
                fill="#8884d8"
              >
                {osEventsWeek?.map((os, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          }
        </div>
        </Loading>
    </div>
  );
};
export default ChartByOs;
