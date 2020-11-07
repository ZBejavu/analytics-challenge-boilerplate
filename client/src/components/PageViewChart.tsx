import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import styled from "styled-components";
import axios from "axios";
import { Loading } from "react-loading-wrapper";
import { Event } from "../models/event";

interface Pages {
  url: string;
  count: number;
}
const PageViewChart = () => {
  const [pages, setPages] = useState<Pages[] | undefined>(undefined);
  const getViewsPerPage = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3001/events/all-filtered?type=pageView`);
      const pageViewEvents: Event[] = data.events;
      if (pageViewEvents) {
        const pages: Pages[] = Array.from(
          new Set(pageViewEvents.map((event: Event) => event.url))
        ).map((url) => {
          return {
            url,
            count: 0,
          };
        });
        pages.forEach((page) => {
            page.count += pageViewEvents.filter((event: Event) => page.url === event.url).length;
          });
        setPages(
          pages.map((page) => {
            return { count:page.count, url: page.url.slice(21,page.url.length) };
          })
        );
      }
    } catch (e) {}
  };
  useEffect(() => {
    getViewsPerPage();
  }, []);
  return (
    <div className='pageViewTile'>
    <h1>Views Per Page</h1>
        <Loading loading={!pages}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="url" />
              <YAxis dataKey="count" />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" barSize={45} fill="#d61e1e" />
            </BarChart>
          </ResponsiveContainer>
        </Loading>
    </div>
  );
};

export default PageViewChart;
