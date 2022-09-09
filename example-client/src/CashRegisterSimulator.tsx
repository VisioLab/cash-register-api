import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { CashRegister } from "./client";
import Stack from "@mui/material/Stack";

interface Props {
  ipAddress: string;
}
const ConnectionForm = ({ ipAddress }: Props) => {
  const socket = new WebSocket(`ws://${ipAddress}/visiolab-cash-register`);
  const cashRegister = new CashRegister(socket);

  return (
    <Stack spacing={2}>
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
    </Stack>
  );
};

export default ConnectionForm;
