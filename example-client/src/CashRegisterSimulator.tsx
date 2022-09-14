import { Button, Chip, Divider } from "@mui/material";
import { CashRegister } from "./client";
import Stack from "@mui/material/Stack";
import Basket from "./Basket";
import ConnectionState from "./ConnectionState";
import useCashRegisterStore from "./store";
import { useEffect, useMemo } from "react";

interface Props {
  ipAddress: string;
}

const CashRegisterSimulator = ({ ipAddress }: Props) => {
  const cashRegister = useMemo(() => new CashRegister(
    new WebSocket(`ws://${ipAddress}/visiolab-cash-register`)), [ipAddress]);

  useEffect(() => {
    return () => {
      cashRegister.ws.close();
    }
  })
  
  cashRegister.ws;
  const state = useCashRegisterStore();
  return (
    <Stack spacing={2}>
      <ConnectionState />
      <Divider>Actions</Divider>
      <Button variant="contained" onClick={() => cashRegister.paymentSuccess()}>
        Payment Success
      </Button>
      <Button variant="contained" onClick={() => cashRegister.paymentFailure()}>
        Payment Failure
      </Button>
      <Button variant="contained" onClick={() => cashRegister.syncArticles()}>
        Sync Articles
      </Button>
      <Button variant="contained" onClick={() => cashRegister.showDialog()}>
        Show Dialog
      </Button>
      <Button variant="contained" onClick={() => cashRegister.closeDialog()}>
        Close Dialog
      </Button>
      <Divider>State</Divider>
      <Basket />
      <Chip
        label={`Payment in progress: ${state.paymentInProgress} `}
        color="primary"
        variant={state.paymentInProgress ? "filled" : "outlined"}
      />
      <Chip label={`Survey result: ${state.surveyResult}`} color="primary" />
    </Stack>
  );
};

export default CashRegisterSimulator;
