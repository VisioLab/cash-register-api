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
      {ipAddress !== "" && <CashRegisterSimulator ipAddress={ipAddress} />}
    </div>
  );
};

export default App;
