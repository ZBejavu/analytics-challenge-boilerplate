import ErrorBoundry from "components/ErrorBoundary";
import ByDaysTile from "components/ByDaysTile";
import ByHoursTile from "components/ByHoursTile";
import UserRetention from "components/UserRetention";
import React from "react";
import UserLocationTile from "components/UserLocationTile";
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
        <UserRetention />
      </ErrorBoundry>
    </div>
  );
};

export default DashBoard;
