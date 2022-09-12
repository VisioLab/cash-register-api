import { useState } from "react";
import "./App.css";
import { CashRegister } from "./client";
import { Button, TextField, FormControl } from "@mui/material";
import ConnectionForm from "./ConnectionForm";
import CashRegisterSimulator from "./CashRegisterSimulator";

const App = () => {
  const [ipAddress, setIpAddress] = useState("");

  return (
    <div className="App">
      <h1>VisioLab Example Client</h1>
      {ipAddress === "" && <ConnectionForm setIpAddress={setIpAddress} />}
      {ipAddress !== "" && (
        <CashRegisterSimulator
          socket={
            new WebSocket(`ws://${ipAddress}:5173/visiolab-cash-register`)
          }
        />
      )}
    </div>
  );
};

export default App;
