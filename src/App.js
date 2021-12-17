//import logo from './logo.svg';
import React from "react";
import "./App.css";
import Datafetch from "./Datafetch";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  let [timeBegin, setTimeBegin] = React.useState(0);
  let [timeEnd, setTimeEnd] = React.useState(0);

  return (
    <div>
      <Datafetch timeBegin={timeBegin} timeEnd={timeEnd} />
      Start date:
      <input
        type="date"
        name="datetime"
        onChange={(e) => {
          var variable = e.target.value;
          var date = new Date(variable).getTime() / 1000;

          setTimeBegin(date);
        }}
      />
      End date:
      <input
        type="date"
        name="datetime"
        onChange={(e) => {
          var variable = e.target.value;
          var date = new Date(variable).getTime() / 1000 + 3600;

          setTimeEnd(date);
        }}
      />
    </div>
  );
}

export default App;
