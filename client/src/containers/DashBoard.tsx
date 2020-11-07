import ErrorBoundry from "components/ErrorBoundary";
import ByDaysTile from "components/ByDaysTile";
import ByHoursTile from "components/ByHoursTile";
import UserLocationTile from "components/UserLocationTile";
import UserRetention from "components/UserRetention";
import PageViewChart from 'components/PageViewChart';
import ChartByOs from 'components/ChartByOs';
import EventLog from "components/EventLog";
import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import '../styles/dashboard.css';
import { Resizable } from "re-resizable";
export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC = () => {
  return (
    <div className='dashboard'>
      <ErrorBoundry>
        <UserLocationTile />
      </ErrorBoundry>
        <ErrorBoundry>
          <ByDaysTile />
        </ErrorBoundry>
        <ErrorBoundry>
          <ByHoursTile />
        </ErrorBoundry>
        <ErrorBoundry>
          <PageViewChart />
        </ErrorBoundry>
        <ErrorBoundry>
          <ChartByOs />
        </ErrorBoundry>
      <ErrorBoundry>
        <UserRetention />
      </ErrorBoundry>
      <ErrorBoundry>
        <EventLog />
      </ErrorBoundry>
    </div>
  );
};

export default DashBoard;
