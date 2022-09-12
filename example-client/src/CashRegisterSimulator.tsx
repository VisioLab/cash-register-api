import { Button, Chip, Divider } from "@mui/material";
import { CashRegister } from "./client";
import Stack from "@mui/material/Stack";
import Basket from "./Basket";

interface Props {
  ipAddress: string;
}
const ConnectionForm = ({ ipAddress }: Props) => {
  const socket = new WebSocket(`ws://${ipAddress}/visiolab-cash-register`);
  const cashRegister = new CashRegister(socket);

  return (
    <Stack spacing={2}>
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
      <Basket articles={cashRegister.basket} />
      <Chip
        label={`Payment in progress: ${cashRegister.paymentInProgress} `}
        color="primary"
        variant={cashRegister.paymentInProgress ? "filled" : "outlined"}
      />
      <Chip
        label={`Survey result: ${cashRegister.surveyResult}`}
        color="primary"
      />
    </Stack>
  );
};

export default ConnectionForm;
