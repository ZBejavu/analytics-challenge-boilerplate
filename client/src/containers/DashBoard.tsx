import ErrorBoundry from "components/ErrorBoundary";
import ByDaysTile from "components/ByDaysTile";
import ByHoursTile from "components/ByHoursTile";
import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC = () => {
  return (
    <div >
      <ErrorBoundry>
        <ByDaysTile />
      </ErrorBoundry>
      <ErrorBoundry>
        <ByHoursTile />
      </ErrorBoundry>
    </div>
  );
};

export default DashBoard;
